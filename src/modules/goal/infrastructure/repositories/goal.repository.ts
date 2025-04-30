import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';

import { Goal } from '~/modules/goal/domain/models/goal';
import { GoalFilter, IGoalRepository } from '~/modules/goal/domain/repositories/goal.repository.interface';
import { GoalEntity } from '~/modules/goal/infrastructure/entities/goal.entity';
import { GoalMapper } from '~/modules/goal/infrastructure/mappers/goal.mappers';

@Injectable()
export class GoalRepository implements IGoalRepository {
  constructor(
    @InjectRepository(GoalEntity)
    private readonly goalRepository: Repository<GoalEntity>
  ) {}

  async findById(id: string): Promise<Goal | null> {
    const goalEntity = await this.goalRepository.findOne({ where: { id } });
    return goalEntity ? GoalMapper.toDomain(goalEntity) : null;
  }

  async findMany(filter: GoalFilter): Promise<Goal[]> {
    const { userId, year, month, day } = filter;
    const findOptionsWhere: FindOptionsWhere<GoalEntity> = {
      userId,
    };
    if (year !== undefined && month !== undefined && day !== undefined) {
      const startDate = new Date(year, month - 1, day); // 월은 0부터 시작하므로 -1
      const endDate = new Date(year, month - 1, day + 1); // 다음 날

      // Between 조건 사용
      findOptionsWhere.createdAt = Between(startDate, endDate);
    } else if (year !== undefined && month !== undefined) {
      const startDate = new Date(year, month - 1, 1); // 월은 0부터 시작하므로 -1
      const endDate = new Date(year, month, 0); // 다음 달의 0일 = 현재 달의 마지막 일

      // Between 조건 사용
      findOptionsWhere.createdAt = Between(startDate, endDate);
    }

    const goalEntities = await this.goalRepository.find({
      where: findOptionsWhere,
      order: { createdAt: 'ASC' },
    });

    return GoalMapper.toDomains(goalEntities);
  }

  async save(goal: Goal): Promise<void>;
  async save(goals: Goal[]): Promise<void>;
  async save(goals: Goal | Goal[]): Promise<void> {
    if (Array.isArray(goals)) {
      const goalEntities = GoalMapper.toEntities(goals);
      await this.goalRepository.save(goalEntities);
    } else {
      const goalEntity = GoalMapper.toEntity(goals);
      await this.goalRepository.save(goalEntity);
    }
  }
}

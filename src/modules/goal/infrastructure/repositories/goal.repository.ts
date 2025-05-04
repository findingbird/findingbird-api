import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, In, Repository } from 'typeorm';

import { DateUtils } from '~/common/utils/Date.utils';
import { GoalFilter, IGoalRepository } from '~/modules/goal/application/ports/out/goal.repository.port';
import { Goal } from '~/modules/goal/domain/models/goal';
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

  async findByBirdIds(userId: string, birdIds: string[]): Promise<Goal[]> {
    const goalEntities = await this.goalRepository.find({
      where: { userId, birdId: In(birdIds) },
    });
    return GoalMapper.toDomains(goalEntities);
  }

  async findMany(filter: GoalFilter): Promise<Goal[]> {
    const { userId, year, month, day } = filter;
    const findOptionsWhere: FindOptionsWhere<GoalEntity> = {
      userId,
    };

    if (year !== undefined && month !== undefined && day !== undefined) {
      const startDate = DateUtils.toUtcDate(`${year}-${month}-${day}`);
      const endDate = DateUtils.toUtcDate(`${year}-${month}-${day + 1}`);

      // Between 조건 사용
      findOptionsWhere.createdAt = Between(startDate, endDate);
    } else if (year !== undefined && month !== undefined) {
      const startDate = DateUtils.toUtcDate(`${year}-${month}-01`);
      const endDate = DateUtils.toUtcDate(`${year}-${month + 1}-01`);

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

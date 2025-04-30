import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, Repository } from 'typeorm';

import { DateUtils } from '~/common/utils/Date.utils';
import { Record } from '~/modules/record/domain/models/record';
import { IRecordRepository, RecordFilter } from '~/modules/record/domain/repositories/record.repository.interface';
import { RecordEntity } from '~/modules/record/infrastructure/entities/record.entity';
import { RecordMapper } from '~/modules/record/infrastructure/mappers/record.mapper';

@Injectable()
export class RecordRepository implements IRecordRepository {
  constructor(
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>
  ) {}

  async findById(id: string): Promise<Record | null> {
    const recordEntity = await this.recordRepository.findOne({ where: { id } });
    return recordEntity ? RecordMapper.toDomain(recordEntity) : null;
  }

  async findMany(filter: RecordFilter): Promise<Record[]> {
    const { userId, year, month } = filter;
    const findOptionsWhere: FindOptionsWhere<RecordEntity> = {
      userId,
    };
    if (year !== undefined && month !== undefined) {
      const startDate = DateUtils.toUtcDate(`${year}-${month}-01`);
      const endDate = DateUtils.toUtcDate(`${year}-${month + 1}-01`);

      // Between 조건 사용
      findOptionsWhere.createdAt = Between(startDate, endDate);
    }

    const recordEntities = await this.recordRepository.find({
      where: findOptionsWhere,
      order: { createdAt: 'ASC' },
    });

    return RecordMapper.toDomains(recordEntities);
  }

  async save(record: Record): Promise<void>;
  async save(records: Record[]): Promise<void>;
  async save(records: Record | Record[]): Promise<void> {
    if (Array.isArray(records)) {
      const recordEntities = RecordMapper.toEntities(records);
      await this.recordRepository.save(recordEntities);
    } else {
      const recordEntity = RecordMapper.toEntity(records);
      await this.recordRepository.save(recordEntity);
    }
  }
}

import { Dayjs } from 'dayjs';

import { Record } from '~/modules/record/domain/models/record';

export class RecordResultDto {
  readonly id: string;
  readonly userId: string;
  readonly imageUrl: string;
  readonly name: string | null;
  readonly district: string;
  readonly size: string;
  readonly color: string;
  readonly locationDescription: string;
  readonly goalId: string | null;
  readonly createdAt: Dayjs;

  static fromDomain(record: Record): RecordResultDto {
    return {
      id: record.id,
      userId: record.userId,
      imageUrl: record.imageUrl,
      name: record.name,
      district: record.district,
      size: record.size,
      color: record.color,
      locationDescription: record.locationDescription,
      goalId: record.goalId,
      createdAt: record.createdAt,
    };
  }
}

import { Dayjs } from 'dayjs';

import { IRecordResponseDto } from '~/modules/record/application/interfaces/record-reader.interface';
import { Record } from '~/modules/record/domain/models/record';

export class RecordResponseDto implements IRecordResponseDto {
  id: string;
  district: string;
  createdAt: Dayjs;

  static fromDomain(record: Record): RecordResponseDto {
    return {
      id: record.id,
      district: record.district,
      createdAt: record.createdAt,
    };
  }
}

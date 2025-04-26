import { Record } from '~/modules/record/domain/models/record';

export const RECORD_REPOSITORY = Symbol('IRecordRepository');

export interface IRecordRepository {
  findById(id: string): Promise<Record | null>;
  findMany(filter: RecordFilter): Promise<Record[]>;
  save(record: Record): Promise<void>;
  save(records: Record[]): Promise<void>;
}

export interface RecordFilter {
  userId: string;
  year?: number;
  month?: number;
}

import { CreateRecordDto } from '~/modules/record/application/dtos/create-record.dto';
import { GetRecordByIdDto } from '~/modules/record/application/dtos/get-record-by-id.dto';
import { GetRecordsByMonthDto } from '~/modules/record/application/dtos/get-records-by-month.dto';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';

export const RECORD_SERVICE = Symbol('IRecordService');

export interface IRecordService {
  createRecord(dto: CreateRecordDto): Promise<RecordResultDto>;
  getRecordById(dto: GetRecordByIdDto): Promise<RecordResultDto>;
  getRecordsByMonth(dto: GetRecordsByMonthDto): Promise<RecordResultDto[]>;
}

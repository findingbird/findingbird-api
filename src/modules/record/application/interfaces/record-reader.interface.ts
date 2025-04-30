import { GetRecordsByMonthDto } from '~/modules/record/application/dtos/get-records-by-month.dto';

export const RECORD_READER = Symbol('IRecordReader');
export interface IRecordReader {
  getRecordsByMonth(dto: GetRecordsByMonthDto): Promise<IRecordResponseDto[]>;
}

export interface IRecordResponseDto {
  id: string;
  district: string;
  createdAt: string;
}

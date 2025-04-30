import { IGoalResponseDto } from '~/modules/goal/application/interfaces/goal-reader.interface';
import { IRecordResponseDto } from '~/modules/record/application/interfaces/record-reader.interface';

export class CalendarDataDto {
  dailyData: DailyDataDto[];
}

export class DailyDataDto {
  date: number;
  hasRecords: boolean;
  records: IRecordResponseDto[];
  hasGoals: boolean;
  goals: IGoalResponseDto[];
}

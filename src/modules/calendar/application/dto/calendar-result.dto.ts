import { GoalResultDto } from '~/modules/goal/application/dtos/goal-result.dto';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';

export class CalendarResultDto {
  dailyData: DailyDataDto[];
}

export class DailyDataDto {
  date: number;
  hasRecords: boolean;
  records: RecordResultDto[];
  hasGoals: boolean;
  goals: GoalResultDto[];
}

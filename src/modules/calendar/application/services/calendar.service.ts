import { Inject, Injectable } from '@nestjs/common';

import { CalendarResultDto, DailyDataDto } from '~/modules/calendar/application/dto/calendar-result.dto';
import { GetCalendarDto } from '~/modules/calendar/application/dto/get-calendar.dto';
import { GoalResultDto } from '~/modules/goal/application/dtos/goal-result.dto';
import { GOAL_SERVICE, IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';
import { IRecordService, RECORD_SERVICE } from '~/modules/record/application/ports/in/record.service.port';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(RECORD_SERVICE)
    private readonly recordService: IRecordService,
    @Inject(GOAL_SERVICE)
    private readonly goalService: IGoalService
  ) {}

  async getCalendar(dto: GetCalendarDto): Promise<CalendarResultDto> {
    const { userId, year, month } = dto;
    const records = await this.recordService.getRecordsByMonth({ userId, year, month });
    const goals = await this.goalService.getGoalsByMonth({ userId, year, month });

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const calenarDataByDate = new Map<number, { records: RecordResultDto[]; goals: GoalResultDto[] }>();

    for (let day = 1; day <= lastDayOfMonth; day++) {
      calenarDataByDate.set(day, { records: [], goals: [] });
    }

    for (const record of records) {
      const date = record.createdAt.date();
      calenarDataByDate.get(date)?.records.push(record);
    }
    for (const goal of goals) {
      const date = goal.createdAt.date();
      calenarDataByDate.get(date)?.goals.push(goal);
    }

    const dailyData: DailyDataDto[] = Array.from(calenarDataByDate.entries()).map(([date, { records, goals }]) => ({
      date,
      hasRecords: records.length > 0,
      records,
      hasGoals: goals.length > 0,
      goals,
    }));

    dailyData.sort((a, b) => a.date - b.date);

    return { dailyData };
  }
}

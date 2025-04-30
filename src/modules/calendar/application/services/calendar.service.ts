import { Inject, Injectable } from '@nestjs/common';

import { CalendarDataDto, DailyDataDto } from '~/modules/calendar/application/dto/calendar.dto';
import { GetCalendarDto } from '~/modules/calendar/application/dto/get-calendar.dto';
import {
  GOAL_READER,
  IGoalReader,
  IGoalResponseDto,
} from '~/modules/goal/application/interfaces/goal-reader.interface';
import {
  IRecordReader,
  IRecordResponseDto,
  RECORD_READER,
} from '~/modules/record/application/interfaces/record-reader.interface';

@Injectable()
export class CalendarService {
  constructor(
    @Inject(RECORD_READER)
    private readonly recordReader: IRecordReader,
    @Inject(GOAL_READER)
    private readonly goalReader: IGoalReader
  ) {}

  async getCalendar(dto: GetCalendarDto): Promise<CalendarDataDto> {
    const { userId, year, month } = dto;
    const records = await this.recordReader.getRecordsByMonth({ userId, year, month });
    const goals = await this.goalReader.getGoalsByMonth({ userId, year, month });

    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const calenarDataByDate = new Map<number, { records: IRecordResponseDto[]; goals: IGoalResponseDto[] }>();

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

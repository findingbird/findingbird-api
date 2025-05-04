import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { CalendarResultDto } from '~/modules/calendar/application/dto/calendar-result.dto';

export class RecordPreviewDto {
  @ApiProperty({
    description: 'record 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: '자치구',
    example: '성북구',
  })
  district: string;

  @ApiProperty({
    description: '관찰 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;
}

export class GoalPreviewDto {
  @ApiProperty({
    description: 'goal 고유 Id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: '목표 생성 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;
}

export class DailyPreviewDto {
  @ApiProperty({ description: '날짜 (일)', example: 15 })
  date: number;

  @ApiProperty({ description: '해당 날짜에 기록이 존재하는지 여부', example: true })
  hasRecords: boolean;

  @ApiProperty({ description: '해당 날짜의 기록 목록', type: [RecordPreviewDto] })
  records: RecordPreviewDto[];

  @ApiProperty({ description: '해당 날짜에 목표가 존재하는지 여부', example: false })
  hasGoals: boolean;

  @ApiProperty({ description: '해당 날짜의 목표 목록', type: [GoalPreviewDto] })
  goals: GoalPreviewDto[];
}

export class CalendarResponseDto {
  @ApiProperty({
    description: '날짜별 기록 및 목표 목록',
    type: [DailyPreviewDto],
  })
  dailyPreviews: DailyPreviewDto[];

  static fromData(calendar: CalendarResultDto): CalendarResponseDto {
    const response = new CalendarResponseDto();
    response.dailyPreviews = calendar.dailyData.map((dailyData) => {
      const dailyPreview = new DailyPreviewDto();
      dailyPreview.date = dailyData.date;
      dailyPreview.hasRecords = dailyData.hasRecords;
      dailyPreview.records = dailyData.records.map((record) => {
        const recordPreview = new RecordPreviewDto();
        recordPreview.id = record.id;
        recordPreview.district = record.district;
        recordPreview.createdAt = DateUtils.format(record.createdAt);
        return recordPreview;
      });
      dailyPreview.hasGoals = dailyData.hasGoals;
      dailyPreview.goals = dailyData.goals.map((goal) => {
        const goalPreview = new GoalPreviewDto();
        goalPreview.id = goal.id;
        goalPreview.createdAt = DateUtils.format(goal.createdAt);
        return goalPreview;
      });
      return dailyPreview;
    });
    return response;
  }
}

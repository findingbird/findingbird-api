import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

import { DateUtils } from '~/common/utils/Date.utils';
import { CalendarDataDto } from '~/modules/calendar/application/dto/calendar.dto';

export class CalendarRequestQueryDto {
  @ApiProperty({ description: '조회할 연도', example: 2025 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year: number;

  @ApiProperty({ description: '조회할 월(1-12)', example: 4 })
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: number;
}

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

  static fromData(data: CalendarDataDto): CalendarResponseDto {
    const response = new CalendarResponseDto();
    response.dailyPreviews = data.dailyData.map((dailyData) => {
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

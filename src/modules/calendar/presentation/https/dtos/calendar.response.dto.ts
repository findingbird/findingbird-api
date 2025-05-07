import { ApiProperty } from '@nestjs/swagger';

import { CalendarResultDto } from '~/modules/calendar/application/dtos/calendar-result.dto';
import { GoalResponseDto } from '~/modules/calendar/presentation/https/dtos/goal.response.dto';
import { RecordResponseDto } from '~/modules/calendar/presentation/https/dtos/record.reseponse.dto';

export class DailyPreviewDto {
  @ApiProperty({ description: '날짜 (일)', example: 15 })
  date: number;

  @ApiProperty({ description: '해당 날짜에 기록이 존재하는지 여부', example: true })
  hasRecords: boolean;

  @ApiProperty({ description: '해당 날짜의 기록 목록', type: [RecordResponseDto] })
  records: RecordResponseDto[];

  @ApiProperty({ description: '해당 날짜에 목표가 존재하는지 여부', example: false })
  hasGoals: boolean;

  @ApiProperty({ description: '해당 날짜의 목표 목록', type: [GoalResponseDto] })
  goals: GoalResponseDto[];
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
        return RecordResponseDto.fromData(record);
      });
      dailyPreview.hasGoals = dailyData.hasGoals;
      dailyPreview.goals = dailyData.goals.map((goal) => {
        return GoalResponseDto.fromData(goal);
      });
      return dailyPreview;
    });
    return response;
  }
}

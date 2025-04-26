import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class RecordMonthQueryDto {
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
    description: '관찰 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;
}

export class DailyRecordDto {
  @ApiProperty({ description: '날짜 (일)', example: 15 })
  date: number;

  @ApiProperty({ description: '해당 날짜에 기록이 존재하는지 여부', example: true })
  hasRecords: boolean;

  @ApiProperty({ description: '해당 날짜의 기록 목록', type: [RecordPreviewDto] })
  records: RecordPreviewDto[];
}

export class RecordByMonthResponseDto {
  @ApiProperty({ description: '날짜별 기록 목록', type: [DailyRecordDto] })
  dailyRecords: DailyRecordDto[];
}

import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { ReportResultDto } from '~/modules/report/application/dtos/report-result.dto';

export class ReportPreviewResponseDto {
  @ApiProperty({
    description: 'report 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: 'user nickname',
    example: '까치5394',
  })
  nickname: string;

  @ApiProperty({
    description: 'report 제목',
    example: '우리 집 앞마당에 새가 부딪혔어요',
  })
  title: string;

  @ApiProperty({
    description: '신고 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromData(report: ReportResultDto): ReportPreviewResponseDto {
    return {
      id: report.id,
      nickname: report.nickname,
      title: report.title,
      createdAt: DateUtils.format(report.createdAt),
    };
  }
}

import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { ReportResultDto } from '~/modules/report/application/dtos/report-result.dto';

export class ReportResponseDto {
  @ApiProperty({
    description: 'report 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: 'user 고유 Id',
    example: '4dcc664b-93f2-4179-9ff1-d838164feb54',
  })
  userId: string;

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
    description: '개체 수',
    example: 3,
  })
  birdCount: number;

  @ApiProperty({
    description: '충돌 장소 유형',
    example: '가정 집 유리창',
  })
  collisionSiteType: string;

  @ApiProperty({
    description: '저감 조치 적용 여부',
    example: true,
  })
  mitigationApplied: boolean;

  @ApiProperty({
    description: '생물종 정보',
    example: '까치',
  })
  speciesInfo: string;

  @ApiProperty({
    description: '관찰 위치',
    example: '서울특별시 강남구 삼성동',
  })
  observationLocation: string;

  @ApiProperty({
    description: '관찰 내역',
    example: '우리 집 앞마당에 새가 부딪혔어요',
  })
  description: string;

  @ApiProperty({
    description: 'image 파일 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  imageFileId: string;

  @ApiProperty({
    description: 'image 파일 URL',
    example: 'https://example.com/image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: '신고 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromData(report: ReportResultDto): ReportResponseDto {
    return {
      id: report.id,
      userId: report.userId,
      nickname: report.nickname,
      title: report.title,
      birdCount: report.birdCount,
      collisionSiteType: report.collisionSiteType,
      mitigationApplied: report.mitigationApplied,
      speciesInfo: report.speciesInfo,
      observationLocation: report.observationLocation,
      description: report.description,
      imageFileId: report.imageFileId,
      imageUrl: report.imageUrl,
      createdAt: DateUtils.format(report.createdAt),
    };
  }
}

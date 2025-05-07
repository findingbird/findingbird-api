import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';

export class RecordResponseDto {
  @ApiProperty({
    description: 'record 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: 'image 파일 경로',
    example: 'https://example.com/bird-image.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: '새 이름',
    type: 'string',
    nullable: true,
    example: '참새',
  })
  name: string | null;

  @ApiProperty({
    description: '자치구',
    example: '성북구',
  })
  district: string;

  @ApiProperty({
    description: '새 크기',
    example: '중간',
  })
  size: string;

  @ApiProperty({
    description: '새 색상',
    example: '갈색',
  })
  color: string;

  @ApiProperty({
    description: '관찰 위치 설명',
    example: '한강공원 나무 위',
  })
  locationDescription: string;

  @ApiProperty({
    description: '목표 Id (null인 경우 AI 제안 X)',
    example: 'e98d519f-44ba-4ec5-b153-aa4904fa3992',
    type: 'string',
    nullable: true,
  })
  goalId: string | null;

  @ApiProperty({
    description: '관찰 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromData(record: RecordResultDto): RecordResponseDto {
    return {
      id: record.id,
      imageUrl: record.imageUrl,
      name: record.name,
      district: record.district,
      size: record.size,
      color: record.color,
      locationDescription: record.locationDescription,
      goalId: record.goalId,
      createdAt: DateUtils.format(record.createdAt),
    };
  }
}

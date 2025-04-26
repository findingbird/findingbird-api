import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { Record } from '~/modules/record/domain/models/record';

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
    description: '관찰 좌표',
    example: '37.5665,126.9780',
  })
  coordinate: string;

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
    description: 'AI 제안 여부',
    example: false,
  })
  isSuggested: boolean;

  @ApiProperty({
    description: '관찰 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromDomain(record: Record): RecordResponseDto {
    return {
      id: record.id,
      imageUrl: record.imageUrl,
      name: record.name,
      coordinate: record.coordinate,
      size: record.size,
      color: record.color,
      locationDescription: record.locationDescription,
      isSuggested: record.isSuggested,
      createdAt: DateUtils.format(record.createdAt),
    };
  }
}

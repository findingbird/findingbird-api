import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { BannerResultDto } from '~/modules/banner/application/dtos/banner-result.dto';

export class BannerResponseDto {
  @ApiProperty({
    description: 'banner 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: 'banner 제목',
    example: '조류충돌 예방 배너너',
  })
  title: string;

  @ApiProperty({
    description: '배너 연결 링크',
    example: 'https://example.com',
  })
  link: string;

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
    description: '배너 등록 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromData(banner: BannerResultDto): BannerResponseDto {
    return {
      id: banner.id,
      title: banner.title,
      link: banner.link,
      imageFileId: banner.imageFileId,
      imageUrl: banner.imageUrl,
      createdAt: DateUtils.format(banner.createdAt),
    };
  }
}

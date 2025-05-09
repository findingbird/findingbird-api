import { ApiProperty } from '@nestjs/swagger';

import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { BirdResponseDto } from '~/modules/goal/presentation/http/dtos/bird.response.dto';

export class BirdWithDotResponseDto extends BirdResponseDto {
  @ApiProperty({
    description: '도트 이미지 URL',
    example: 'https://example.com/bird.jpg',
  })
  dotImageUrl: string;

  static fromData(birdResult: BirdResultDto): BirdWithDotResponseDto {
    return {
      ...BirdResponseDto.fromData(birdResult),
      dotImageUrl:
        birdResult.bookImageUrl ||
        'https://findingbird.s3.ap-northeast-2.amazonaws.com/birdbook/%EC%A7%91%EB%B9%84%EB%91%98%EA%B8%B0.png',
    };
  }
}

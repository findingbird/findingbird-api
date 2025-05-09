import { ApiProperty } from '@nestjs/swagger';

import { BookResultDto } from '~/modules/goal/application/dtos/book-result.dto';
import { BirdWithDotResponseDto } from '~/modules/goal/presentation/http/dtos/bird-with-dot.response.dto';

export class BirdInBookDto {
  @ApiProperty({
    description: '발견하였는지 여부(도감 채웠는지 여부)',
    example: 'true',
  })
  isFound: boolean;

  @ApiProperty({
    description: '새 정보',
    type: BirdWithDotResponseDto,
  })
  bird: BirdWithDotResponseDto;
}

export class BookResponseDto {
  @ApiProperty({
    description: '도감에 등록된 새 목록',
    type: [BirdInBookDto],
  })
  birds: BirdInBookDto[];

  static fromData(book: BookResultDto): BookResponseDto {
    return {
      birds: book.birds.map((bird) => ({
        isFound: bird.isFound,
        bird: BirdWithDotResponseDto.fromData(bird.bird),
      })),
    };
  }
}

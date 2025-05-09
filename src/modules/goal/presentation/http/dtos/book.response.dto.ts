import { ApiProperty } from '@nestjs/swagger';

import { BookResultDto } from '~/modules/goal/application/dtos/book-result.dto';
import { BirdResponseDto } from '~/modules/goal/presentation/http/dtos/bird.response.dto';

export class BirdInBookDto {
  @ApiProperty({
    description: '발견하였는지 여부(도감 채웠는지 여부)',
    example: 'true',
  })
  isFound: boolean;

  @ApiProperty({
    description: '새 정보',
    type: BirdResponseDto,
  })
  bird: BirdResponseDto;
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
        bird: BirdResponseDto.getBookFromData(bird.bird),
      })),
    };
  }
}

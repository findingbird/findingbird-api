import { ApiProperty } from '@nestjs/swagger';

import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';

export class BirdResponseDto {
  @ApiProperty({
    description: '새 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: '종명',
    example: '해오라기',
  })
  speciesName: string;

  @ApiProperty({
    description: '학명',
    example: 'Nycticorax nycticorax',
    nullable: true,
  })
  scientificName: string | null;

  @ApiProperty({
    description: '서식형태',
    example: '여름철새',
  })
  habitatType: string;

  @ApiProperty({
    description: '출현 횟수',
    example: 54,
  })
  appearanceCount: number;

  @ApiProperty({
    description: '형태 특성',
    example:
      '몸길이는 57~65cm이다. 머리꼭대기에서 뒷목까지 흑색이며 등은 녹색을 띤 흑색이다. 눈앞, 얼굴, 목, 아랫면은 회백색이며, 머리꼭대기에는 백색의 장식깃 두가닥이 길게 늘어져 있다. 홍채는 적갈색이다.',
    nullable: true,
  })
  morphoTrait: string | null;

  @ApiProperty({
    description: '생태 특성',
    example:
      '텃새 또는 여름철새로 갈대밭, 호숫가, 하천, 습지 등지에서 생활하며 소나무, 삼나무, 잡목림에서 둥지를 튼다. 어류, 새우, 개구리, 뱀, 곤충등을 먹는다.',
    nullable: true,
  })
  ecoTrait: string | null;

  @ApiProperty({
    description: '자치구명',
    example: [
      '강남구',
      '강동구',
      '강북구',
      '강서구',
      '광진구',
      '노원구',
      '동대문구',
      '마포구',
      '서초구',
      '성동구',
      '송파구',
      '영등포구',
      '용산구',
      '종로구',
      '중랑구',
    ],
  })
  districts: string[];

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://example.com/bird.jpg',
  })
  imageUrl: string;

  static fromData(birdResult: BirdResultDto): BirdResponseDto {
    return {
      id: birdResult.id,
      speciesName: birdResult.speciesName,
      scientificName: birdResult.scientificName,
      habitatType: birdResult.habitatType,
      appearanceCount: birdResult.appearanceCount,
      morphoTrait: birdResult.morphoTrait,
      ecoTrait: birdResult.ecoTrait,
      districts: birdResult.districts,
      imageUrl: birdResult.imageUrl,
    };
  }
}

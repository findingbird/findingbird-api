import { ApiProperty } from '@nestjs/swagger';

import { Bird } from '~/modules/bird/domain/models/bird';

export class BirdResponseDto {
  @ApiProperty({
    description: '새 고유 ID',
    example: '27247e40-5d23-4051-bd15-473fcf5928fe',
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
  })
  scientificName: string | null;

  @ApiProperty({
    description: '서식형태',
    example: '여름철새',
  })
  habitatType: string;

  @ApiProperty({
    description: '등장횟수',
    example: '54',
  })
  appearanceCount: number;

  @ApiProperty({
    description: '형태특성',
    example:
      '몸길이는 57~65cm이다. 머리꼭대기에서 뒷목까지 흑색이며 등은 녹색을 띤 흑색이다. 눈앞, 얼굴, 목, 아랫면은 회백색이며, 머리꼭대기에는 백색의 장식깃 두가닥이 길게 늘어져 있다. 홍채는 적갈색이다.',
  })
  morphoTrait: string | null;

  @ApiProperty({
    description: '생태특성',
    example:
      '텃새 또는 여름철새로 갈대밭, 호숫가, 하천, 습지 등지에서 생활하며 소나무, 삼나무, 잡목림에서 둥지를 튼다. 어류, 새우, 개구리, 뱀, 곤충등을 먹는다.',
  })
  ecoTrait: string | null;

  @ApiProperty({
    description: '자치구명',
    isArray: true,
    type: 'string',
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
    example: 'https://example.com/bird-image.jpg',
  })
  imageUrl: string;

  static fromDomain(bird: Bird): BirdResponseDto {
    return {
      id: bird.id,
      speciesName: bird.speciesName,
      scientificName: bird.scientificName,
      habitatType: bird.habitatType,
      morphoTrait: bird.morphoTrait,
      ecoTrait: bird.ecoTrait,
      districts: bird.districts,
      imageUrl: bird.imageUrl,
      appearanceCount: bird.appearanceCount,
    };
  }
}

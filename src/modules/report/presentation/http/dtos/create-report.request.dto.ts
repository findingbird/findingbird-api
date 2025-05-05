import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateReportRequestDto {
  @ApiProperty({
    description: 'report 제목',
    example: '우리 집 앞마당에 새가 부딪혔어요',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '개체 수',
    example: 3,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  birdCount: number;

  @ApiProperty({
    description: '충돌 장소 유형',
    example: '가정 집 유리창',
  })
  @IsString()
  @IsNotEmpty()
  collisionSiteType: string;

  @ApiProperty({
    description: '저감 조치 적용 여부',
    example: true,
  })
  @IsBoolean()
  @Type(() => Boolean)
  mitigationApplied: boolean;

  @ApiProperty({
    description: '생물종 정보',
    example: '까치',
  })
  @IsString()
  @IsNotEmpty()
  speciesInfo: string;

  @ApiProperty({
    description: '관찰 위치',
    example: '서울특별시 강남구 삼성동',
  })
  @IsString()
  @IsNotEmpty()
  observationLocation: string;

  @ApiProperty({
    description: '관찰 내역',
    example: '우리 집 앞마당에 새가 부딪혔어요',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateReportSwaggerDto extends CreateReportRequestDto {
  @ApiProperty({
    description: '충돌 사진',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

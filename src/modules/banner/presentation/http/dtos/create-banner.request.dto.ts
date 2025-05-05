import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBannerRequestDto {
  @ApiProperty({
    description: 'banner 제목',
    example: '조류충돌 예방 배너',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '배너 연결 링크',
    example: 'https://example.com',
  })
  @IsString()
  @IsNotEmpty()
  link: string;
}

export class CreateBannerSwaggerDto extends CreateBannerRequestDto {
  @ApiProperty({
    description: '배너 이미지',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

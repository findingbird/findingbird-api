import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateRecordRequestDto {
  @ApiProperty({
    description: '발견한 새의 이름 (알 수 없는 경우 null)',
    type: 'string',
    example: '참새',
    required: false,
  })
  @Transform(({ value }: { value: string | undefined }) => {
    if (value === undefined || value === '') {
      return null;
    }
    return value;
  })
  @ValidateIf((o: CreateRecordRequestDto) => o.name !== null)
  @IsString()
  @IsNotEmpty()
  name: string | null;

  @ApiProperty({
    description: '발견 좌표 (위도,경도 형식)',
    example: '37.5665,126.9780',
  })
  @IsString()
  @IsNotEmpty()
  coordinate: string;

  @ApiProperty({
    description: '새의 크기',
    example: '중간',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    description: '새의 색상',
    example: '갈색',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    description: '발견 위치에 대한 설명',
    example: '한강공원 나무 위',
  })
  @IsString()
  @IsNotEmpty()
  locationDescription: string;

  @ApiProperty({
    description: 'AI 추천 여부',
    example: false,
  })
  @IsBoolean()
  isSuggested: boolean;
}

export class CreateRecordSwaggerDto extends CreateRecordRequestDto {
  @ApiProperty({
    description: '발견한 새의 사진',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

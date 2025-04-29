import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

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
    description: '자치구',
    example: '성북구',
  })
  @IsString()
  @IsNotEmpty()
  district: string;

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
    description: '목표 Id (null인 경우 AI 제안 X)',
    example: 'e98d519f-44ba-4ec5-b153-aa4904fa3992',
    type: 'string',
    required: false,
  })
  @Transform(({ value }: { value: string | undefined }) => {
    if (value === undefined || value === '') {
      return null;
    }
    return value;
  })
  @ValidateIf((o: CreateRecordRequestDto) => o.goalId !== null)
  @IsString()
  @IsNotEmpty()
  goalId: string | null;
}

export class CreateRecordSwaggerDto extends CreateRecordRequestDto {
  @ApiProperty({
    description: '발견한 새의 사진',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

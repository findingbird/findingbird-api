import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGoalRequestDto {
  @ApiProperty({
    description: '사용자 자치구',
    example: '성북구',
  })
  @IsString()
  @IsNotEmpty()
  district: string;
}

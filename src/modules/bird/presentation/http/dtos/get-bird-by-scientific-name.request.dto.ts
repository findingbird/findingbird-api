import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class getBirdByScientificNameRequestQueryDto {
  @ApiProperty({
    description: '영문이름(scientific name)',
    example: 'Aegithalos caudatus',
  })
  @IsString()
  @IsNotEmpty()
  scientificName: string;
}

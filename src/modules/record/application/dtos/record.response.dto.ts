import { ApiProperty } from '@nestjs/swagger';

import { DateUtils } from '~/common/utils/Date.utils';
import { IRecordResponseDto } from '~/modules/record/application/interfaces/record-reader.interface';
import { Record } from '~/modules/record/domain/models/record';

export class RecordResponseDto implements IRecordResponseDto {
  @ApiProperty({
    description: 'record 고유 Id',
    example: '550e5ba2-62dd-4903-bfa7-80ac57d63721',
  })
  id: string;

  @ApiProperty({
    description: '자치구',
    example: '성북구',
  })
  district: string;

  @ApiProperty({
    description: '관찰 일자',
    example: '2025-04-25 21:45:23',
  })
  createdAt: string;

  static fromDomain(record: Record): RecordResponseDto {
    return {
      id: record.id,
      district: record.district,
      createdAt: DateUtils.format(record.createdAt),
    };
  }
}

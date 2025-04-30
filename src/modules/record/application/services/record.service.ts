import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { FileService } from '~/modules/file/application/services/file.service';
import { CreateRecordDto } from '~/modules/record/application/dtos/create-record.dto';
import { GetRecordByIdDto } from '~/modules/record/application/dtos/get-record-by-id.dto';
import { GetRecordsByMonthDto } from '~/modules/record/application/dtos/get-records-by-month.dto';
import { RecordResponseDto } from '~/modules/record/application/dtos/record.response.dto';
import { IRecordReader } from '~/modules/record/application/interfaces/record-reader.interface';
import { Record } from '~/modules/record/domain/models/record';
import { IRecordRepository, RECORD_REPOSITORY } from '~/modules/record/domain/repositories/record.repository.interface';

@Injectable()
export class RecordService implements IRecordReader {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: IRecordRepository,
    private readonly fileService: FileService
  ) {}

  async getRecordsByMonth(dto: GetRecordsByMonthDto): Promise<RecordResponseDto[]> {
    const { userId, year, month } = dto;
    const records = await this.recordRepository.findMany({ userId, year, month });
    return records.map((record) => RecordResponseDto.fromDomain(record));
  }

  async createRecord(dto: CreateRecordDto): Promise<Record> {
    const { userId, image, name, district, size, color, locationDescription, goalId } = dto;

    const savedFile = await this.fileService.uploadFile({
      file: image,
      directory: 'records',
      allowedTypes: ['image/jpeg', 'image/png'],
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    const record = Record.createNew({
      userId,
      imageFileId: savedFile.id,
      imageUrl: savedFile.url,
      name,
      district,
      size,
      color,
      locationDescription,
      goalId,
    });
    await this.recordRepository.save(record);

    return record;
  }

  async getRecordById(dto: GetRecordByIdDto): Promise<Record> {
    const { recordId } = dto;
    const record = await this.recordRepository.findById(recordId);
    if (!record) {
      throw new NotFoundError(Record.domainName, recordId);
    }

    return record;
  }
}

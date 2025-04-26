import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { FileService } from '~/modules/file/application/services/file.service';
import { CreateRecordDto } from '~/modules/record/application/dtos/create-record.dto';
import { GetRecordByIdDto } from '~/modules/record/application/dtos/get-record-by-id.dto';
import { Record } from '~/modules/record/domain/models/record';
import { IRecordRepository, RECORD_REPOSITORY } from '~/modules/record/domain/repositories/record.repository.interface';

@Injectable()
export class RecordService {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: IRecordRepository,
    private readonly fileService: FileService
  ) {}

  async createRecord(dto: CreateRecordDto): Promise<Record> {
    const { userId, image, name, coordinate, size, color, locationDescription, isSuggested } = dto;

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
      coordinate,
      size,
      color,
      locationDescription,
      isSuggested,
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

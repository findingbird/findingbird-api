import { Inject, Injectable } from '@nestjs/common';

import { FILE_SERVICE, IFileService } from '~/modules/file/application/ports/in/file.service.port';
import { CreateRecordForOnboardingDto } from '~/modules/record/application/dtos/create-record-for-onboarding.dto';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';
import { IRecordForOnboardingService } from '~/modules/record/application/ports/in/record-for-onboarding.service.port';
import { IRecordRepository, RECORD_REPOSITORY } from '~/modules/record/application/ports/out/record.repository.port';
import { Record } from '~/modules/record/domain/models/record';

@Injectable()
export class RecordForOnboardingService implements IRecordForOnboardingService {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: IRecordRepository,
    @Inject(FILE_SERVICE)
    private readonly fileService: IFileService
  ) {}

  async createRecordForOnboarding(dto: CreateRecordForOnboardingDto): Promise<RecordResultDto> {
    const { userId, image, name, district, size, color, locationDescription, createdAt } = dto;

    const savedFile = await this.fileService.uploadFile({
      file: image,
      directory: 'records',
      allowedTypes: ['image/jpeg', 'image/png'],
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    const record = Record.createNewForOnboarding({
      userId,
      imageFileId: savedFile.id,
      imageUrl: savedFile.url,
      name,
      district,
      size,
      color,
      locationDescription,
      createdAt,
    });
    await this.recordRepository.save(record);

    return RecordResultDto.fromDomain(record);
  }
}

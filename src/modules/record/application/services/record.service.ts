import { Inject, Injectable } from '@nestjs/common';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { FILE_SERVICE, IFileService } from '~/modules/file/application/ports/in/file.service.port';
import { GOAL_SERVICE, IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { CreateRecordDto } from '~/modules/record/application/dtos/create-record.dto';
import { GetRecordByIdDto } from '~/modules/record/application/dtos/get-record-by-id.dto';
import { GetRecordsByMonthDto } from '~/modules/record/application/dtos/get-records-by-month.dto';
import { RecordResultDto } from '~/modules/record/application/dtos/record-result.dto';
import { IRecordService } from '~/modules/record/application/ports/in/record.service.port';
import { IRecordRepository, RECORD_REPOSITORY } from '~/modules/record/application/ports/out/record.repository.port';
import { Record } from '~/modules/record/domain/models/record';

@Injectable()
export class RecordService implements IRecordService {
  constructor(
    @Inject(RECORD_REPOSITORY)
    private readonly recordRepository: IRecordRepository,
    @Inject(GOAL_SERVICE)
    private readonly goalService: IGoalService,
    @Inject(FILE_SERVICE)
    private readonly fileService: IFileService
  ) {}

  async createRecord(dto: CreateRecordDto): Promise<RecordResultDto> {
    const { userId, image, name, district, size, color, locationDescription, goalId } = dto;

    if (goalId !== null) {
      await this.goalService.completeGoal({
        userId,
        goalId,
      });
    }

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

    return RecordResultDto.fromDomain(record);
  }

  async getRecordById(dto: GetRecordByIdDto): Promise<RecordResultDto> {
    const { recordId, userId } = dto;
    const record = await this.recordRepository.findById(recordId);
    if (!record) {
      throw new NotFoundError(Record.domainName, recordId);
    }

    if (record.userId !== userId) {
      throw new BadRequestError(Record.domainName, 'Cannot access record of another user');
    }

    return RecordResultDto.fromDomain(record);
  }

  async getRecordsByMonth(dto: GetRecordsByMonthDto): Promise<RecordResultDto[]> {
    const { userId, year, month } = dto;
    const records = await this.recordRepository.findMany({ userId, year, month });
    return records.map((record) => RecordResultDto.fromDomain(record));
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '~/modules/file/file.module';
import { GoalModule } from '~/modules/goal/goal.module';
import { RECORD_READER } from '~/modules/record/application/interfaces/record-reader.interface';
import { RecordService } from '~/modules/record/application/services/record.service';
import { RECORD_REPOSITORY } from '~/modules/record/domain/repositories/record.repository.interface';
import { RecordEntity } from '~/modules/record/infrastructure/entities/record.entity';
import { RecordRepository } from '~/modules/record/infrastructure/repositories/record.repository';
import { RecordController } from '~/modules/record/presentation/http/record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity]), FileModule, GoalModule],
  controllers: [RecordController],
  providers: [
    RecordService,
    {
      provide: RECORD_REPOSITORY,
      useClass: RecordRepository,
    },
    {
      provide: RECORD_READER,
      useExisting: RecordService,
    },
  ],
  exports: [RECORD_READER],
})
export class RecordModule {}

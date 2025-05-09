import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '~/modules/file/file.module';
import { GoalModule } from '~/modules/goal/goal.module';
import { RECORD_SERVICE } from '~/modules/record/application/ports/in/record.service.port';
import { RECORD_FOR_ONBOARDING_SERVICE } from '~/modules/record/application/ports/in/record-for-onboarding.service.port';
import { RECORD_REPOSITORY } from '~/modules/record/application/ports/out/record.repository.port';
import { RecordService } from '~/modules/record/application/services/record.service';
import { RecordForOnboardingService } from '~/modules/record/application/services/record-for-onboarding.service';
import { RecordEntity } from '~/modules/record/infrastructure/entities/record.entity';
import { RecordRepository } from '~/modules/record/infrastructure/repositories/record.repository';
import { RecordController } from '~/modules/record/presentation/http/record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RecordEntity]), FileModule, GoalModule],
  controllers: [RecordController],
  providers: [
    {
      provide: RECORD_SERVICE,
      useClass: RecordService,
    },
    {
      provide: RECORD_REPOSITORY,
      useClass: RecordRepository,
    },
    {
      provide: RECORD_FOR_ONBOARDING_SERVICE,
      useClass: RecordForOnboardingService,
    },
  ],
  exports: [RECORD_SERVICE, RECORD_FOR_ONBOARDING_SERVICE],
})
export class RecordModule {}

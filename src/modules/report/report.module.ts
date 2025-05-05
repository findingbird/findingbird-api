import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileModule } from '~/modules/file/file.module';
import { REPORT_SERVICE } from '~/modules/report/application/ports/in/report.service.port';
import { REPORT_REPOSITORY } from '~/modules/report/application/ports/out/report.repository.port';
import { ReportService } from '~/modules/report/application/services/report.service';
import { ReportEntity } from '~/modules/report/infrastructure/entities/report.entity';
import { ReportRepository } from '~/modules/report/infrastructure/repositories/report.repository';
import { ReportController } from '~/modules/report/presentation/http/report.controller';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ReportEntity]), FileModule, UserModule],
  controllers: [ReportController],
  providers: [
    {
      provide: REPORT_SERVICE,
      useClass: ReportService,
    },
    {
      provide: REPORT_REPOSITORY,
      useClass: ReportRepository,
    },
  ],
  exports: [],
})
export class ReportModule {}

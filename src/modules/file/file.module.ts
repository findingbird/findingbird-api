import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FILE_SERVICE } from '~/modules/file/application/ports/in/file.service.port';
import { FILE_REPOSITORY } from '~/modules/file/application/ports/out/file.repository.port';
import { S3_CLIENT } from '~/modules/file/application/ports/out/s3.client.port';
import { FileService } from '~/modules/file/application/services/file.service';
import { FileEntity } from '~/modules/file/infrastructure/entities/file.entity';
import { FileRepository } from '~/modules/file/infrastructure/repositories/file.repository';
import { S3CustomClient } from '~/modules/file/infrastructure/s3/s3.client';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [],
  providers: [
    {
      provide: FILE_SERVICE,
      useClass: FileService,
    },
    {
      provide: FILE_REPOSITORY,
      useClass: FileRepository,
    },
    {
      provide: S3_CLIENT,
      useClass: S3CustomClient,
    },
  ],
  exports: [FILE_SERVICE],
})
export class FileModule {}

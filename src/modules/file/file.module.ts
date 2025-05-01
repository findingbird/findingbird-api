import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FILE_PERSISTER } from '~/modules/file/application/interfaces/file-persister.interface';
import { FILE_READER } from '~/modules/file/application/interfaces/file-reader.interface';
import { FileService } from '~/modules/file/application/services/file.service';
import { FILE_REPOSITORY } from '~/modules/file/domain/repositories/file.repository.interface';
import { FileEntity } from '~/modules/file/infrastructure/entities/file.entity';
import { FileRepository } from '~/modules/file/infrastructure/repositories/file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity])],
  controllers: [],
  providers: [
    FileService,
    {
      provide: FILE_REPOSITORY,
      useClass: FileRepository,
    },
    {
      provide: FILE_READER,
      useExisting: FileService,
    },
    {
      provide: FILE_PERSISTER,
      useExisting: FileService,
    },
  ],
  exports: [FILE_READER, FILE_PERSISTER],
})
export class FileModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  exports: [FileService],
})
export class FileModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IFileRepository } from '~/modules/file/application/ports/out/file.repository.port';
import { File } from '~/modules/file/domain/models/file';
import { FileEntity } from '~/modules/file/infrastructure/entities/file.entity';
import { FileMapper } from '~/modules/file/infrastructure/mappers/file.mapper';

@Injectable()
export class FileRepository implements IFileRepository {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>
  ) {}

  async findById(id: string): Promise<File | null> {
    const fileEntity = await this.fileRepository.findOne({ where: { id } });
    return fileEntity ? FileMapper.toDomain(fileEntity) : null;
  }

  async save(file: File): Promise<void>;
  async save(files: File[]): Promise<void>;
  async save(files: File | File[]): Promise<void> {
    if (Array.isArray(files)) {
      const fileEntities = files.map((file) => FileMapper.toEntity(file));
      await this.fileRepository.save(fileEntities);
    } else {
      const fileEntity = FileMapper.toEntity(files);
      await this.fileRepository.save(fileEntity);
    }
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DeleteFileDto } from '~/modules/file/application/dtos/delete-file.dto';
import { FileResultDto } from '~/modules/file/application/dtos/file-result.dto';
import { GetFilebyIdDto } from '~/modules/file/application/dtos/get-file-by-id.dto';
import { UploadFileDto } from '~/modules/file/application/dtos/upload-file.dto';
import { IFileService } from '~/modules/file/application/ports/in/file.service.port';
import { FILE_REPOSITORY, IFileRepository } from '~/modules/file/application/ports/out/file.repository.port';
import { IS3Client, S3_CLIENT } from '~/modules/file/application/ports/out/s3.client.port';
import { File } from '~/modules/file/domain/models/file';

@Injectable()
export class FileService implements IFileService {
  constructor(
    @Inject(S3_CLIENT)
    private readonly s3Client: IS3Client,
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository
  ) {}

  async getFileById(dto: GetFilebyIdDto): Promise<FileResultDto> {
    const { fileId } = dto;
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError(File.domainName, fileId);
    }

    return FileResultDto.fromDomain(file);
  }

  async uploadFile(dto: UploadFileDto): Promise<FileResultDto> {
    const { file, directory = 'uploads', allowedTypes, maxSize = 5 * 1024 * 1024 } = dto;

    if (maxSize && file.size > maxSize) {
      throw new BadRequestError(File.domainName, `File size exceeds the limit (${maxSize / 1024 / 1024}MB)`);
    }

    if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      throw new BadRequestError(File.domainName, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const { filename, key, url } = await this.s3Client.uploadFile({
      directory,
      file,
    });

    // 파일 도메인 엔티티 생성
    const fileEntity = File.createNew({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: key,
      url,
    });
    await this.fileRepository.save(fileEntity);

    return FileResultDto.fromDomain(fileEntity);
  }

  async deleteFile(dto: DeleteFileDto): Promise<void> {
    const { fileId } = dto;
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      return;
    }

    await this.s3Client.deleteFile({ key: file.path });
    file.delete();
    await this.fileRepository.save(file);
  }
}

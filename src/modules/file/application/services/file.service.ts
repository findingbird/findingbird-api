import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DeleteFileDto } from '~/modules/file/application/dtos/delete-file.dto';
import { FileResponseDto } from '~/modules/file/application/dtos/file.response.dto';
import { GetFilebyIdDto } from '~/modules/file/application/dtos/get-file-by-id.dto';
import { UploadFileDto } from '~/modules/file/application/dtos/upload-file.dto';
import { IFilePersister } from '~/modules/file/application/interfaces/file-persister.interface';
import { IFileReader } from '~/modules/file/application/interfaces/file-reader.interface';
import { File } from '~/modules/file/domain/models/file';
import { FILE_REPOSITORY, IFileRepository } from '~/modules/file/domain/repositories/file.repository.interface';

@Injectable()
export class FileService implements IFileReader, IFilePersister {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly environment: string;

  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepository: IFileRepository,
    private readonly configService: ConfigService
  ) {
    // S3 클라이언트 초기화
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'ap-northeast-2'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    this.environment = this.configService.get<string>('NODE_ENV') || 'development';

    if (!this.bucketName) {
      throw new InternalServerError(File.domainName, 'S3 bucket name is not configured');
    }
  }

  async getFileById(dto: GetFilebyIdDto): Promise<FileResponseDto> {
    const { fileId } = dto;
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      throw new NotFoundError(File.domainName, fileId);
    }

    return FileResponseDto.fromDomain(file);
  }

  async uploadFile(dto: UploadFileDto): Promise<FileResponseDto> {
    const { file, directory = 'uploads', allowedTypes, maxSize = 5 * 1024 * 1024 } = dto;

    if (maxSize && file.size > maxSize) {
      throw new BadRequestError(File.domainName, `File size exceeds the limit (${maxSize / 1024 / 1024}MB)`);
    }

    if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
      throw new BadRequestError(File.domainName, `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    const fileExt = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExt}`;

    const s3Key = `${this.environment}/${directory}/${filename}`;

    try {
      // S3에 파일 업로드
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${encodeURIComponent(file.originalname)}"`,
      });
      await this.s3Client.send(uploadCommand);

      const s3Url = `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;

      // 파일 도메인 엔티티 생성
      const fileEntity = File.createNew({
        filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: s3Key,
        url: s3Url,
      });
      await this.fileRepository.save(fileEntity);

      return FileResponseDto.fromDomain(fileEntity);
    } catch (error: unknown) {
      throw new InternalServerError(
        File.domainName,
        `Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteFile(dto: DeleteFileDto): Promise<void> {
    const { fileId } = dto;
    const file = await this.fileRepository.findById(fileId);
    if (!file) {
      return;
    }

    try {
      // S3에서 파일 삭제
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: file.path,
      });
      await this.s3Client.send(deleteCommand);

      file.delete();
      await this.fileRepository.save(file);
    } catch (error: unknown) {
      throw new InternalServerError(
        `Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

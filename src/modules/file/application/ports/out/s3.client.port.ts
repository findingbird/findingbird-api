import { S3DeleteDto } from '~/modules/file/application/dtos/s3-delete.dto';
import { S3ResponseDto } from '~/modules/file/application/dtos/s3-response.dto';
import { S3UploadDto } from '~/modules/file/application/dtos/s3-upload.dto';

export const S3_CLIENT = Symbol('IS3Client');

export interface IS3Client {
  uploadFile(dto: S3UploadDto): Promise<S3ResponseDto>;
  deleteFile(dto: S3DeleteDto): Promise<void>;
}

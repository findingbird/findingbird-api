import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { S3DeleteDto } from '~/modules/file/application/dtos/s3-delete.dto';
import { S3ResponseDto } from '~/modules/file/application/dtos/s3-response.dto';
import { S3UploadDto } from '~/modules/file/application/dtos/s3-upload.dto';
import { IS3Client } from '~/modules/file/application/ports/out/s3.client.port';

@Injectable()
export class S3CustomClient implements IS3Client {
  private readonly s3: S3Client;
  private readonly region: string;
  private readonly bucket: string;
  private readonly environment: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION', 'ap-northeast-2');
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME') || '';
    if (!this.bucket) {
      throw new InternalServerError('S3', 'S3 bucket name is not configured');
    }
    this.environment = this.configService.get<string>('NODE_ENV') || 'development';
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async uploadFile(dto: S3UploadDto): Promise<S3ResponseDto> {
    const { directory, file } = dto;
    const fileExt = extname(file.originalname);
    const filename = `${uuidv4()}${fileExt}`;
    const s3Key = `${this.environment}/${directory}/${filename}`;

    try {
      const uploadParams = {
        Bucket: this.bucket,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${encodeURIComponent(file.originalname)}"`,
      };

      await this.s3.send(new PutObjectCommand(uploadParams));

      const s3Url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${s3Key}`;

      return { filename, key: s3Key, url: s3Url };
    } catch (error) {
      throw new InternalServerError(
        'S3',
        `Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async deleteFile(dto: S3DeleteDto): Promise<void> {
    const { key } = dto;
    try {
      const deleteParams = {
        Bucket: this.bucket,
        Key: key,
      };

      await this.s3.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new InternalServerError(
        'S3',
        `Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

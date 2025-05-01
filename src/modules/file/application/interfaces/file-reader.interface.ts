import { GetFilebyIdDto } from '~/modules/file/application/dtos/get-file-by-id.dto';

export const FILE_READER = Symbol('IFileReader');

export interface IFileReader {
  getFileById(dto: GetFilebyIdDto): Promise<IFileResponseDto>;
}

export interface IFileResponseDto {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

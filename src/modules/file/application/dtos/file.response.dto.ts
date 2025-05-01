import { IFileResponseDto } from '~/modules/file/application/interfaces/file-reader.interface';
import { File } from '~/modules/file/domain/models/file';

export class FileResponseDto implements IFileResponseDto {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;

  static fromDomain(file: File): FileResponseDto {
    return {
      id: file.id,
      filename: file.props.filename,
      originalName: file.props.originalName,
      mimeType: file.props.mimeType,
      size: file.props.size,
      path: file.props.path,
      url: file.props.url,
    };
  }
}

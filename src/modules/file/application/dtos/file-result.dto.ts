import { File } from '~/modules/file/domain/models/file';

export class FileResultDto {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;

  static fromDomain(file: File): FileResultDto {
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

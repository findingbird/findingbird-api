import { DeleteFileDto } from '~/modules/file/application/dtos/delete-file.dto';
import { UploadFileDto } from '~/modules/file/application/dtos/upload-file.dto';
import { IFileResponseDto } from '~/modules/file/application/interfaces/file-reader.interface';

export const FILE_PERSISTER = Symbol('IFilePersister');

export interface IFilePersister {
  uploadFile(dto: UploadFileDto): Promise<IFileResponseDto>;
  deleteFile(dto: DeleteFileDto): Promise<void>;
}

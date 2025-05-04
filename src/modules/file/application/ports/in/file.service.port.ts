import { DeleteFileDto } from '~/modules/file/application/dtos/delete-file.dto';
import { FileResultDto } from '~/modules/file/application/dtos/file-result.dto';
import { GetFilebyIdDto } from '~/modules/file/application/dtos/get-file-by-id.dto';
import { UploadFileDto } from '~/modules/file/application/dtos/upload-file.dto';

export const FILE_SERVICE = Symbol('IFileService');

export interface IFileService {
  uploadFile(dto: UploadFileDto): Promise<FileResultDto>;
  getFileById(dto: GetFilebyIdDto): Promise<FileResultDto>;
  deleteFile(dto: DeleteFileDto): Promise<void>;
}

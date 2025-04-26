import { File } from '~/modules/file/domain/models/file';

export const FILE_REPOSITORY = Symbol('IFileRepository');

export interface IFileRepository {
  findById(id: string): Promise<File | null>;
  save(file: File): Promise<void>;
  save(files: File[]): Promise<void>;
}

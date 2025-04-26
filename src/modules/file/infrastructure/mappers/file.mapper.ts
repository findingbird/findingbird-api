import { DateUtils } from '~/common/utils/Date.utils';
import { File, FileProps } from '~/modules/file/domain/models/file';
import { FileEntity } from '~/modules/file/infrastructure/entities/file.entity';

export class FileMapper {
  static toDomain(entity: FileEntity): File {
    const fileProps: FileProps = {
      filename: entity.filename,
      originalName: entity.originalName,
      mimeType: entity.mimeType,
      size: entity.size,
      path: entity.path,
      url: entity.url,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return File.create(entity.id, fileProps);
  }

  static toDomains(entities: FileEntity[]): File[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(file: File): FileEntity {
    const fileEntity = new FileEntity();
    fileEntity.id = file.id;
    fileEntity.filename = file.props.filename;
    fileEntity.originalName = file.props.originalName;
    fileEntity.mimeType = file.props.mimeType;
    fileEntity.size = file.props.size;
    fileEntity.path = file.props.path;
    fileEntity.url = file.props.url;
    fileEntity.createdAt = DateUtils.toUtcDate(file.props.createdAt);
    fileEntity.updatedAt = DateUtils.toUtcDate(file.props.updatedAt);
    fileEntity.deletedAt = file.props.deletedAt ? DateUtils.toUtcDate(file.props.deletedAt) : null;

    return fileEntity;
  }

  static toEntities(files: File[]): FileEntity[] {
    if (files.length === 0) return [];

    return files.map((file) => this.toEntity(file));
  }
}

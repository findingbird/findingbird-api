import { DateUtils } from '~/common/utils/Date.utils';
import { Record, RecordProps } from '~/modules/record/domain/models/record';
import { RecordEntity } from '~/modules/record/infrastructure/entities/record.entity';

export class RecordMapper {
  static toDomain(entity: RecordEntity): Record {
    const recordProps: RecordProps = {
      userId: entity.userId,
      imageFileId: entity.imageFileId,
      imageUrl: entity.imageUrl,
      name: entity.name,
      district: entity.district,
      size: entity.size,
      color: entity.color,
      locationDescription: entity.locationDescription,
      goalId: entity.goalId,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Record.create(entity.id, recordProps);
  }

  static toDomains(entities: RecordEntity[]): Record[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(record: Record): RecordEntity {
    const recordEntity = new RecordEntity();
    recordEntity.id = record.id;
    recordEntity.userId = record.props.userId;
    recordEntity.imageFileId = record.props.imageFileId;
    recordEntity.imageUrl = record.props.imageUrl;
    recordEntity.name = record.props.name;
    recordEntity.district = record.props.district;
    recordEntity.size = record.props.size;
    recordEntity.color = record.props.color;
    recordEntity.locationDescription = record.props.locationDescription;
    recordEntity.goalId = record.props.goalId;
    recordEntity.createdAt = DateUtils.toUtcDate(record.props.createdAt);
    recordEntity.updatedAt = DateUtils.toUtcDate(record.props.updatedAt);
    recordEntity.deletedAt = record.props.deletedAt ? DateUtils.toUtcDate(record.props.deletedAt) : null;

    return recordEntity;
  }

  static toEntities(records: Record[]): RecordEntity[] {
    if (records.length === 0) return [];

    return records.map((record) => this.toEntity(record));
  }
}

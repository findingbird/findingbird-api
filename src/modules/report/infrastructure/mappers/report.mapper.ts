import { DateUtils } from '~/common/utils/Date.utils';
import { Report, ReportProps } from '~/modules/report/domain/models/report';
import { ReportEntity } from '~/modules/report/infrastructure/entities/report.entity';

export class ReportMapper {
  static toDomain(entity: ReportEntity): Report {
    const reportProps: ReportProps = {
      userId: entity.userId,
      title: entity.title,
      birdCount: entity.birdCount,
      collisionSiteType: entity.collisionSiteType,
      mitigationApplied: entity.mitigationApplied,
      speciesInfo: entity.speciesInfo,
      observationLocation: entity.observationLocation,
      description: entity.description,
      imageFileId: entity.imageFileId,
      imageUrl: entity.imageUrl,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Report.create(entity.id, reportProps);
  }

  static toDomains(entities: ReportEntity[]): Report[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(report: Report): ReportEntity {
    const reportEntity = new ReportEntity();

    reportEntity.id = report.id;
    reportEntity.userId = report.userId;
    reportEntity.title = report.title;
    reportEntity.birdCount = report.birdCount;
    reportEntity.collisionSiteType = report.collisionSiteType;
    reportEntity.mitigationApplied = report.mitigationApplied;
    reportEntity.speciesInfo = report.speciesInfo;
    reportEntity.observationLocation = report.observationLocation;
    reportEntity.description = report.description;
    reportEntity.imageFileId = report.imageFileId;
    reportEntity.imageUrl = report.imageUrl;
    reportEntity.createdAt = DateUtils.toUtcDate(report.createdAt);
    reportEntity.updatedAt = DateUtils.toUtcDate(report.updatedAt);
    reportEntity.deletedAt = report.deletedAt ? DateUtils.toUtcDate(report.deletedAt) : null;

    return reportEntity;
  }

  static toEntities(reports: Report[]): ReportEntity[] {
    if (reports.length === 0) return [];

    return reports.map((report) => this.toEntity(report));
  }
}

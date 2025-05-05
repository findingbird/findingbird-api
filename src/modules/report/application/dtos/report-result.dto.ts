import { Dayjs } from 'dayjs';

import { Report } from '~/modules/report/domain/models/report';
import { UserResultDto } from '~/modules/user/application/dtos/user-result.dto';

export class ReportResultDto {
  readonly id: string;
  readonly userId: string;
  readonly nickname: string;
  readonly title: string;
  readonly birdCount: number;
  readonly collisionSiteType: string;
  readonly mitigationApplied: boolean;
  readonly speciesInfo: string;
  readonly observationLocation: string;
  readonly description: string;
  readonly imageFileId: string;
  readonly imageUrl: string;
  readonly createdAt: Dayjs;

  static fromDomain(report: Report, userData: UserResultDto): ReportResultDto {
    return {
      id: report.id,
      userId: report.userId,
      nickname: userData.nickname,
      title: report.title,
      birdCount: report.birdCount,
      collisionSiteType: report.collisionSiteType,
      mitigationApplied: report.mitigationApplied,
      speciesInfo: report.speciesInfo,
      observationLocation: report.observationLocation,
      description: report.description,
      imageFileId: report.imageFileId,
      imageUrl: report.imageUrl,
      createdAt: report.createdAt,
    };
  }
}

import { Inject } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { FILE_SERVICE, IFileService } from '~/modules/file/application/ports/in/file.service.port';
import { CreateReportDto } from '~/modules/report/application/dtos/create-report.dto';
import { GetReportByIdDto } from '~/modules/report/application/dtos/get-report-by-id.dto';
import { ReportResultDto } from '~/modules/report/application/dtos/report-result.dto';
import { IReportService } from '~/modules/report/application/ports/in/report.service.port';
import { IReportRepository, REPORT_REPOSITORY } from '~/modules/report/application/ports/out/report.repository.port';
import { Report } from '~/modules/report/domain/models/report';
import { UserResultDto } from '~/modules/user/application/dtos/user-result.dto';
import { IUserService, USER_SERVICE } from '~/modules/user/application/ports/in/user.service.port';
import { User } from '~/modules/user/domain/models/user';

export class ReportService implements IReportService {
  constructor(
    @Inject(REPORT_REPOSITORY)
    private readonly reportRepository: IReportRepository,
    @Inject(FILE_SERVICE)
    private readonly fileService: IFileService,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService
  ) {}

  async createReport(dto: CreateReportDto): Promise<ReportResultDto> {
    const {
      userId,
      title,
      birdCount,
      collisionSiteType,
      mitigationApplied,
      speciesInfo,
      observationLocation,
      description,
      image,
    } = dto;

    const user = await this.userService.getUserById({ userId });

    const savedFile = await this.fileService.uploadFile({
      file: image,
      directory: 'reports',
      allowedTypes: ['image/jpeg', 'image/png'],
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    const report = Report.createNew({
      userId,
      title,
      birdCount,
      collisionSiteType,
      mitigationApplied,
      speciesInfo,
      observationLocation,
      description,
      imageFileId: savedFile.id,
      imageUrl: savedFile.url,
    });
    await this.reportRepository.save(report);

    return ReportResultDto.fromDomain(report, user);
  }

  async getReportById(dto: GetReportByIdDto): Promise<ReportResultDto> {
    const { reportId } = dto;
    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundError(Report.domainName, reportId);
    }
    const user = await this.userService.getUserById({ userId: report.userId });

    return ReportResultDto.fromDomain(report, user);
  }

  async getAllReports(): Promise<ReportResultDto[]> {
    const reports = await this.reportRepository.findMany({});
    const users = await this.userService.getUsersByIds({
      ids: reports.map((report) => report.userId),
    });
    const userMap = new Map<string, UserResultDto>();
    users.forEach((user) => {
      userMap.set(user.userId, user);
    });
    return reports.map((report) => {
      const user = userMap.get(report.userId);
      if (!user) {
        throw new NotFoundError(User.domainName, report.userId);
      }
      return ReportResultDto.fromDomain(report, user);
    });
  }
}

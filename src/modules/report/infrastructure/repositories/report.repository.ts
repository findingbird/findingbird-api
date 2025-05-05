import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { IReportRepository, ReportFilter } from '~/modules/report/application/ports/out/report.repository.port';
import { Report } from '~/modules/report/domain/models/report';
import { ReportEntity } from '~/modules/report/infrastructure/entities/report.entity';
import { ReportMapper } from '~/modules/report/infrastructure/mappers/report.mapper';

export class ReportRepository implements IReportRepository {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>
  ) {}

  async findById(id: string): Promise<Report | null> {
    const reportEntity = await this.reportRepository.findOne({ where: { id } });
    if (!reportEntity) return null;

    return ReportMapper.toDomain(reportEntity);
  }

  async findMany(filter: ReportFilter): Promise<Report[]> {
    const { userId } = filter;
    const findOptionsWhere: FindOptionsWhere<ReportEntity> = {};
    if (userId) {
      findOptionsWhere.userId = userId;
    }

    const reportEntities = await this.reportRepository.find({
      where: findOptionsWhere,
      order: { createdAt: 'DESC' },
    });
    return ReportMapper.toDomains(reportEntities);
  }

  async save(report: Report): Promise<void>;
  async save(reports: Report[]): Promise<void>;
  async save(reports: Report | Report[]): Promise<void> {
    if (Array.isArray(reports)) {
      const reportEntities = reports.map((report) => ReportMapper.toEntity(report));
      await this.reportRepository.save(reportEntities);
    } else {
      const reportEntity = ReportMapper.toEntity(reports);
      await this.reportRepository.save(reportEntity);
    }
  }
}

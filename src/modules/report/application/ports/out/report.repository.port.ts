import { Report } from '~/modules/report/domain/models/report';

export const REPORT_REPOSITORY = Symbol('IReportRepository');

export interface IReportRepository {
  findById(id: string): Promise<Report | null>;
  findMany(filter: ReportFilter): Promise<Report[]>;
  save(report: Report): Promise<void>;
  save(reports: Report[]): Promise<void>;
}

export interface ReportFilter {
  userId?: string;
}

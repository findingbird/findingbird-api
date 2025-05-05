import { CreateReportDto } from '~/modules/report/application/dtos/create-report.dto';
import { GetReportByIdDto } from '~/modules/report/application/dtos/get-report-by-id.dto';
import { ReportResultDto } from '~/modules/report/application/dtos/report-result.dto';

export const REPORT_SERVICE = Symbol('IReportService');

export interface IReportService {
  createReport(dto: CreateReportDto): Promise<ReportResultDto>;
  getReportById(dto: GetReportByIdDto): Promise<ReportResultDto>;
  getAllReports(): Promise<ReportResultDto[]>;
}

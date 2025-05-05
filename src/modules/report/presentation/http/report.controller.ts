import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { IReportService, REPORT_SERVICE } from '~/modules/report/application/ports/in/report.service.port';
import {
  CreateReportRequestDto,
  CreateReportSwaggerDto,
} from '~/modules/report/presentation/http/dtos/create-report.request.dto';
import { ReportResponseDto } from '~/modules/report/presentation/http/dtos/report.response.dto';
import { ReportPreviewResponseDto } from '~/modules/report/presentation/http/dtos/report-preview.response.dto';

@Controller('report')
export class ReportController {
  constructor(
    @Inject(REPORT_SERVICE)
    private readonly reportService: IReportService
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '조류 충돌 목록 신고 조회',
    description: '조류 충돌 신고 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조류 충돌 목록 조회 성공',
    type: [ReportPreviewResponseDto],
  })
  async getReports(): Promise<ReportPreviewResponseDto[]> {
    const reports = await this.reportService.getAllReports();
    return reports.map((report) => ReportPreviewResponseDto.fromData(report));
  }

  @Get('/:id')
  @ApiOperation({
    summary: '조류 충돌 신고 상세 조회',
    description: '조류 충돌 신고의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '조류 충돌 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '조류 충돌 상세 조회 성공',
    type: ReportResponseDto,
  })
  async getReportById(@Param('id') reportId: string): Promise<ReportResponseDto> {
    const report = await this.reportService.getReportById({ reportId });
    return ReportResponseDto.fromData(report);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '조류 충돌 신고 생성',
    description: '새로운 조류 충돌 신고를 생성합니다.',
  })
  @ApiBody({
    type: CreateReportSwaggerDto,
  })
  @ApiResponse({
    status: 201,
    description: '조류 충돌 신고 생성 성공',
    type: ReportResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createReport(
    @Req() req: UserRequest,
    @Body() body: CreateReportRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ReportResponseDto> {
    const { userId } = req.user;
    const report = await this.reportService.createReport({ ...body, userId, image: file });
    return ReportResponseDto.fromData(report);
  }
}

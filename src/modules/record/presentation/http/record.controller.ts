import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { DateUtils } from '~/common/utils/Date.utils';
import { RecordService } from '~/modules/record/application/services/record.service';
import {
  CreateRecordRequestDto,
  CreateRecordSwaggerDto,
} from '~/modules/record/presentation/http/dtos/create-record.dto';
import { RecordResponseDto } from '~/modules/record/presentation/http/dtos/record.reseponse.dto';
import {
  RecordByMonthResponseDto,
  RecordMonthQueryDto,
  RecordPreviewDto,
} from '~/modules/record/presentation/http/dtos/record-by-month.dto';

@Controller('record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  // @Get('/')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({
  //   summary: '기록 월단위 조회',
  //   description:
  //     '해당 월의 기록을 조회합니다. 모든 날짜에 대한 응답이 담겨있으며 해당 날짜에 기록이 없을 경우 빈 배열이 반환됩니다.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '기록 월단위 조회 성공',
  //   type: RecordByMonthResponseDto,
  // })
  // async getRecordsByMonth(
  //   @Req() req: UserRequest,
  //   @Query() query: RecordMonthQueryDto
  // ): Promise<RecordByMonthResponseDto> {
  //   const { userId } = req.user;
  //   const { year, month } = query;
  //   const records = await this.recordService.getRecordsByMonth({ userId, year, month });

  //   const lastDayOfMonth = new Date(year, month, 0).getDate();
  //   const recordsByDate = new Map<number, RecordPreviewDto[]>();
  //   for (let day = 1; day <= lastDayOfMonth; day++) {
  //     recordsByDate.set(day, []);
  //   }

  //   for (const record of records) {
  //     const date = record.createdAt.date();
  //     recordsByDate.get(date)?.push({ id: record.id, createdAt: DateUtils.format(record.createdAt) });
  //   }

  //   const dailyRecords = Array.from(recordsByDate.entries()).map(([date, records]) => ({
  //     date,
  //     records,
  //     hasRecords: records.length > 0,
  //   }));

  //   dailyRecords.sort((a, b) => a.date - b.date);

  //   return { dailyRecords };
  // }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '기록 상세 조회',
    description: '기록의 상세 정보를 조회합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '기록 ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: '기록 상세 조회 성공',
    type: RecordResponseDto,
  })
  async getRecordById(@Param('id') recordId: string): Promise<RecordResponseDto> {
    const record = await this.recordService.getRecordById({ recordId });
    return RecordResponseDto.fromDomain(record);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '기록 생성',
    description: '새로운 기록을 생성합니다.',
  })
  @ApiBody({
    type: CreateRecordSwaggerDto,
  })
  @ApiResponse({
    status: 201,
    description: '기록 생성 성공',
    type: RecordResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createRecord(
    @Req() req: UserRequest,
    @Body() body: CreateRecordRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<RecordResponseDto> {
    const { userId } = req.user;
    const record = await this.recordService.createRecord({ ...body, userId, image: file });
    return RecordResponseDto.fromDomain(record);
  }
}

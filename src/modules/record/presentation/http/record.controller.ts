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
import { IRecordService, RECORD_SERVICE } from '~/modules/record/application/ports/in/record.service.port';
import {
  CreateRecordRequestDto,
  CreateRecordSwaggerDto,
} from '~/modules/record/presentation/http/dtos/create-record.request.dto';
import { RecordResponseDto } from '~/modules/record/presentation/http/dtos/record.reseponse.dto';

@Controller('record')
export class RecordController {
  constructor(
    @Inject(RECORD_SERVICE)
    private readonly recordService: IRecordService
  ) {}

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
  async getRecordById(@Req() req: UserRequest, @Param('id') recordId: string): Promise<RecordResponseDto> {
    const { userId } = req.user;
    const record = await this.recordService.getRecordById({ recordId, userId });
    return RecordResponseDto.fromData(record);
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
    return RecordResponseDto.fromData(record);
  }
}

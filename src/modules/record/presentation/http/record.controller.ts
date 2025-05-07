import { Body, Controller, Inject, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

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

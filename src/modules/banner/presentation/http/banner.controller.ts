import { Body, Controller, Get, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { BANNER_SERVICE, IBannerService } from '~/modules/banner/application/ports/in/banner.service.port';
import { BannerResponseDto } from '~/modules/banner/presentation/http/dtos/banner.reponse.dto';
import {
  CreateBannerRequestDto,
  CreateBannerSwaggerDto,
} from '~/modules/banner/presentation/http/dtos/create-banner.request.dto';

@Controller('banner')
export class BannerController {
  constructor(
    @Inject(BANNER_SERVICE)
    private readonly bannerService: IBannerService
  ) {}

  @Get('/')
  @ApiOperation({
    summary: '배너 목록 조회',
    description: '배너 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '배너 목록 조회 성공',
    type: [BannerResponseDto],
  })
  async getBanners(): Promise<BannerResponseDto[]> {
    const banners = await this.bannerService.getAllBanners();
    return banners.map((banner) => BannerResponseDto.fromData(banner));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '배너 등록',
    description: '배너를 등록합니다.',
  })
  @ApiBody({
    type: CreateBannerSwaggerDto,
  })
  @ApiResponse({
    status: 201,
    description: '배너 등록 성공',
    type: BannerResponseDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createBanner(
    @Body() body: CreateBannerRequestDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<BannerResponseDto> {
    const banner = await this.bannerService.createBanner({
      ...body,
      image: file,
    });
    return BannerResponseDto.fromData(banner);
  }
}

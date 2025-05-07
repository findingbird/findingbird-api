import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BANNER_SERVICE, IBannerService } from '~/modules/banner/application/ports/in/banner.service.port';
import { BannerResponseDto } from '~/modules/banner/presentation/http/dtos/banner.reponse.dto';

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
}

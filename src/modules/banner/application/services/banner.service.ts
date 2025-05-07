import { Inject } from '@nestjs/common';

import { BannerResultDto } from '~/modules/banner/application/dtos/banner-result.dto';
import { IBannerService } from '~/modules/banner/application/ports/in/banner.service.port';
import { BANNER_REPOSITORY, IBannerRepository } from '~/modules/banner/application/ports/out/banner.repository.port';

export class BannerService implements IBannerService {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository
  ) {}

  async getAllBanners(): Promise<BannerResultDto[]> {
    const banners = await this.bannerRepository.findMany({});
    return banners.map((banner) => BannerResultDto.fromDomain(banner));
  }
}

import { BannerResultDto } from '~/modules/banner/application/dtos/banner-result.dto';
import { CreateBannerDto } from '~/modules/banner/application/dtos/create-banner.dto';

export const BANNER_SERVICE = Symbol('IBannerService');

export interface IBannerService {
  createBanner(dto: CreateBannerDto): Promise<BannerResultDto>;
  getAllBanners(): Promise<BannerResultDto[]>;
}

import { BannerResultDto } from '~/modules/banner/application/dtos/banner-result.dto';

export const BANNER_SERVICE = Symbol('IBannerService');

export interface IBannerService {
  getAllBanners(): Promise<BannerResultDto[]>;
}

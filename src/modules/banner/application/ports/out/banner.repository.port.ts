import { Banner } from '~/modules/banner/domain/models/banner';

export const BANNER_REPOSITORY = Symbol('IBannerRepository');

export interface IBannerRepository {
  findById(id: string): Promise<Banner | null>;
  findMany(filter: BannerFilter): Promise<Banner[]>;
  save(banner: Banner): Promise<void>;
  save(banners: Banner[]): Promise<void>;
}

export interface BannerFilter {}

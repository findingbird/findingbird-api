import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { BannerFilter, IBannerRepository } from '~/modules/banner/application/ports/out/banner.repository.port';
import { Banner } from '~/modules/banner/domain/models/banner';
import { BannerEntity } from '~/modules/banner/infrastructure/entities/banner.entity';
import { BannerMapper } from '~/modules/banner/infrastructure/mappers/banner.mapper';

export class BannerRepository implements IBannerRepository {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>
  ) {}

  async findById(id: string): Promise<Banner | null> {
    const bannerEntity = await this.bannerRepository.findOne({ where: { id } });
    if (!bannerEntity) return null;

    return BannerMapper.toDomain(bannerEntity);
  }

  async findMany(_filter: BannerFilter): Promise<Banner[]> {
    const findOptionsWhere: FindOptionsWhere<BannerEntity> = {};

    const bannerEntities = await this.bannerRepository.find({
      where: findOptionsWhere,
      order: { createdAt: 'DESC' },
    });
    return BannerMapper.toDomains(bannerEntities);
  }

  async save(banner: Banner): Promise<void>;
  async save(banners: Banner[]): Promise<void>;
  async save(banners: Banner | Banner[]): Promise<void> {
    if (Array.isArray(banners)) {
      const bannerEntities = banners.map((banner) => BannerMapper.toEntity(banner));
      await this.bannerRepository.save(bannerEntities);
    } else {
      const bannerEntity = BannerMapper.toEntity(banners);
      await this.bannerRepository.save(bannerEntity);
    }
  }
}

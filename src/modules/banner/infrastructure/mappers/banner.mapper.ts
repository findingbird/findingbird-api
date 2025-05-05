import { DateUtils } from '~/common/utils/Date.utils';
import { Banner, BannerProps } from '~/modules/banner/domain/models/banner';
import { BannerEntity } from '~/modules/banner/infrastructure/entities/banner.entity';

export class BannerMapper {
  static toDomain(entity: BannerEntity): Banner {
    const bannerProps: BannerProps = {
      title: entity.title,
      imageFileId: entity.imageFileId,
      imageUrl: entity.imageUrl,
      link: entity.link,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Banner.create(entity.id, bannerProps);
  }

  static toDomains(entities: BannerEntity[]): Banner[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(banner: Banner): BannerEntity {
    const bannerEntity = new BannerEntity();

    bannerEntity.id = banner.id;
    bannerEntity.title = banner.title;
    bannerEntity.imageFileId = banner.imageFileId;
    bannerEntity.imageUrl = banner.imageUrl;
    bannerEntity.link = banner.link;
    bannerEntity.createdAt = DateUtils.toUtcDate(banner.createdAt);
    bannerEntity.updatedAt = DateUtils.toUtcDate(banner.updatedAt);
    bannerEntity.deletedAt = banner.deletedAt ? DateUtils.toUtcDate(banner.deletedAt) : null;

    return bannerEntity;
  }

  static toEntities(banners: Banner[]): BannerEntity[] {
    if (banners.length === 0) return [];

    return banners.map((banner) => this.toEntity(banner));
  }
}

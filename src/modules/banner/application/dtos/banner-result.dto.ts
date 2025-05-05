import { Dayjs } from 'dayjs';

import { Banner } from '~/modules/banner/domain/models/banner';

export class BannerResultDto {
  readonly id: string;
  readonly title: string;
  readonly imageUrl: string;
  readonly imageFileId: string;
  readonly link: string;
  readonly createdAt: Dayjs;

  static fromDomain(banner: Banner): BannerResultDto {
    return {
      id: banner.id,
      title: banner.title,
      imageUrl: banner.imageUrl,
      imageFileId: banner.imageFileId,
      link: banner.link,
      createdAt: banner.createdAt,
    };
  }
}

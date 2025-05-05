import { Inject } from '@nestjs/common';

import { BannerResultDto } from '~/modules/banner/application/dtos/banner-result.dto';
import { CreateBannerDto } from '~/modules/banner/application/dtos/create-banner.dto';
import { IBannerService } from '~/modules/banner/application/ports/in/banner.service.port';
import { BANNER_REPOSITORY, IBannerRepository } from '~/modules/banner/application/ports/out/banner.repository.port';
import { Banner } from '~/modules/banner/domain/models/banner';
import { FILE_SERVICE, IFileService } from '~/modules/file/application/ports/in/file.service.port';

export class BannerService implements IBannerService {
  constructor(
    @Inject(BANNER_REPOSITORY)
    private readonly bannerRepository: IBannerRepository,
    @Inject(FILE_SERVICE)
    private readonly fileService: IFileService
  ) {}

  async createBanner(dto: CreateBannerDto): Promise<BannerResultDto> {
    const { title, image, link } = dto;

    const savedFile = await this.fileService.uploadFile({
      file: image,
      directory: 'banners',
      allowedTypes: ['image/jpeg', 'image/png'],
      maxSize: 5 * 1024 * 1024, // 5MB
    });

    const banner = Banner.createNew({
      title,
      imageFileId: savedFile.id,
      imageUrl: savedFile.url,
      link,
    });
    await this.bannerRepository.save(banner);

    return BannerResultDto.fromDomain(banner);
  }

  async getAllBanners(): Promise<BannerResultDto[]> {
    const banners = await this.bannerRepository.findMany({});
    return banners.map((banner) => BannerResultDto.fromDomain(banner));
  }
}

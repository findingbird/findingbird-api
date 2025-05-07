import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BANNER_SERVICE } from '~/modules/banner/application/ports/in/banner.service.port';
import { BANNER_REPOSITORY } from '~/modules/banner/application/ports/out/banner.repository.port';
import { BannerService } from '~/modules/banner/application/services/banner.service';
import { BannerEntity } from '~/modules/banner/infrastructure/entities/banner.entity';
import { BannerRepository } from '~/modules/banner/infrastructure/repositories/banner.repository';
import { BannerController } from '~/modules/banner/presentation/http/banner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController],
  providers: [
    {
      provide: BANNER_SERVICE,
      useClass: BannerService,
    },
    {
      provide: BANNER_REPOSITORY,
      useClass: BannerRepository,
    },
  ],
  exports: [BANNER_SERVICE],
})
export class BannerModule {}

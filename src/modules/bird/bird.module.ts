import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BIRD_SERVICE } from '~/modules/bird/application/ports/in/bird.service.port';
import { BIRD_REPOSITORY } from '~/modules/bird/application/ports/out/bird.repository.port';
import { BirdService } from '~/modules/bird/application/services/bird.service';
import { BirdEntity } from '~/modules/bird/infrastructure/entities/bird.entity';
import { BirdRepository } from '~/modules/bird/infrastructure/repositories/bird.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BirdEntity])],
  controllers: [],
  providers: [
    {
      provide: BIRD_SERVICE,
      useClass: BirdService,
    },
    {
      provide: BIRD_REPOSITORY,
      useClass: BirdRepository,
    },
  ],
  exports: [BIRD_SERVICE],
})
export class BirdModule {}

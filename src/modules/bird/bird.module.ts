import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BirdService } from '~/modules/bird/application/services/bird.service';
import { BIRD_REPOSITORY } from '~/modules/bird/domain/repositories/bird.repository.interface';
import { BirdEntity } from '~/modules/bird/infrastructure/entities/bird.entity';
import { BirdRepository } from '~/modules/bird/infrastructure/repositories/bird.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BirdEntity])],
  controllers: [],
  providers: [
    BirdService,
    {
      provide: BIRD_REPOSITORY,
      useClass: BirdRepository,
    },
  ],
  exports: [],
})
export class BirdModule {}

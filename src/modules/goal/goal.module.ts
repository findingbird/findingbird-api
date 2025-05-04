import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiModule } from '~/modules/ai/ai.module';
import { BirdModule } from '~/modules/bird/bird.module';
import { GOAL_SERVICE } from '~/modules/goal/application/ports/in/goal.service.port';
import { GOAL_REPOSITORY } from '~/modules/goal/application/ports/out/goal.repository.port';
import { GoalService } from '~/modules/goal/application/services/goal.service';
import { BirdRecommendationService } from '~/modules/goal/domain/services/bird-recommendation.service';
import { GoalEntity } from '~/modules/goal/infrastructure/entities/goal.entity';
import { GoalRepository } from '~/modules/goal/infrastructure/repositories/goal.repository';
import { BookController } from '~/modules/goal/presentation/http/book.controller';
import { GoalController } from '~/modules/goal/presentation/http/goal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity]), BirdModule, AiModule],
  controllers: [GoalController, BookController],
  providers: [
    {
      provide: GOAL_SERVICE,
      useClass: GoalService,
    },
    {
      provide: GOAL_REPOSITORY,
      useClass: GoalRepository,
    },
    BirdRecommendationService,
  ],
  exports: [GOAL_SERVICE],
})
export class GoalModule {}

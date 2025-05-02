import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AiModule } from '~/modules/ai/ai.module';
import { BirdModule } from '~/modules/bird/bird.module';
import { GOAL_PERSISTER } from '~/modules/goal/application/interfaces/goal-persister.interface';
import { GOAL_READER } from '~/modules/goal/application/interfaces/goal-reader.interface';
import { GoalService } from '~/modules/goal/application/services/goal.service';
import { GOAL_REPOSITORY } from '~/modules/goal/domain/repositories/goal.repository.interface';
import { GoalEntity } from '~/modules/goal/infrastructure/entities/goal.entity';
import { GoalRepository } from '~/modules/goal/infrastructure/repositories/goal.repository';
import { GoalController } from '~/modules/goal/presentation/http/goal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity]), BirdModule, AiModule],
  controllers: [GoalController],
  providers: [
    GoalService,
    {
      provide: GOAL_REPOSITORY,
      useClass: GoalRepository,
    },
    {
      provide: GOAL_READER,
      useExisting: GoalService,
    },
    {
      provide: GOAL_PERSISTER,
      useExisting: GoalService,
    },
  ],
  exports: [GOAL_READER, GOAL_PERSISTER],
})
export class GoalModule {}

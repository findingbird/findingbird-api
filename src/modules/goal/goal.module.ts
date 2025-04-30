import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BirdModule } from '~/modules/bird/bird.module';
import { GoalService } from '~/modules/goal/application/services/goal.service';
import { GOAL_REPOSITORY } from '~/modules/goal/domain/repositories/goal.repository.interface';
import { GoalEntity } from '~/modules/goal/infrastructure/entities/goal.entity';
import { GoalRepository } from '~/modules/goal/infrastructure/repositories/goal.repository';
import { GoalController } from '~/modules/goal/presentation/http/goal.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GoalEntity]), BirdModule],
  controllers: [GoalController],
  providers: [
    GoalService,
    {
      provide: GOAL_REPOSITORY,
      useClass: GoalRepository,
    },
  ],
  exports: [GoalService],
})
export class GoalModule {}

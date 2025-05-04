import { Dayjs } from 'dayjs';

import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalResultDto {
  readonly id: string;
  readonly userId: string;
  readonly birdId: string;
  readonly isCompleted: boolean;
  readonly createdAt: Dayjs;
  readonly bird: BirdResultDto;

  static fromDomain(goal: Goal, birdData: BirdResultDto): GoalResultDto {
    return {
      id: goal.id,
      userId: goal.userId,
      birdId: goal.birdId,
      isCompleted: goal.isCompleted,
      createdAt: goal.createdAt,
      bird: birdData,
    };
  }
}

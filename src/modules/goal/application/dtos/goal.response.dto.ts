import { DateUtils } from '~/common/utils/Date.utils';
import { IGoalResponseDto } from '~/modules/goal/application/interfaces/goal-reader.interface';
import { Goal } from '~/modules/goal/domain/models/goal';

export class GoalResponseDto implements IGoalResponseDto {
  id: string;
  createdAt: string;

  static fromDomain(goal: Goal): GoalResponseDto {
    return {
      id: goal.id,
      createdAt: DateUtils.format(goal.createdAt),
    };
  }
}

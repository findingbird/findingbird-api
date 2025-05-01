import { CompleteGoalDto } from '~/modules/goal/application/dtos/complete-goal.dto';

export const GOAL_PERSISTER = Symbol('IGoalPersister');

export interface IGoalPersister {
  completeGoal(dto: CompleteGoalDto): Promise<void>;
}

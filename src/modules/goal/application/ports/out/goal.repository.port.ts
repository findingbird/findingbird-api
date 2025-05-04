import { Goal } from '~/modules/goal/domain/models/goal';

export const GOAL_REPOSITORY = Symbol('IGoalRepository');

export interface IGoalRepository {
  findById(id: string): Promise<Goal | null>;
  findMany(filter: GoalFilter): Promise<Goal[]>;
  save(goal: Goal): Promise<void>;
  save(goals: Goal[]): Promise<void>;
}

export interface GoalFilter {
  userId: string;
  year?: number;
  month?: number;
  day?: number;
}

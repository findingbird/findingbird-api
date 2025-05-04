import { BookResultDto } from '~/modules/goal/application/dtos/book-result.dto';
import { CompleteGoalDto } from '~/modules/goal/application/dtos/complete-goal.dto';
import { CreateGoalDto } from '~/modules/goal/application/dtos/create-goal.dto';
import { GetBookDto } from '~/modules/goal/application/dtos/get-book.dto';
import { GetGoalByIdDto } from '~/modules/goal/application/dtos/get-goal-by-id.dto';
import { GetGoalsByMonthDto } from '~/modules/goal/application/dtos/get-goals-by-month.dto';
import { GetTodayGoalsDto } from '~/modules/goal/application/dtos/get-today-goals.dto';
import { GoalResultDto } from '~/modules/goal/application/dtos/goal-result.dto';

export const GOAL_SERVICE = Symbol('IGoalService');

export interface IGoalService {
  createGoal(dto: CreateGoalDto): Promise<GoalResultDto>;
  completeGoal(dto: CompleteGoalDto): Promise<GoalResultDto>;
  getGoalById(dto: GetGoalByIdDto): Promise<GoalResultDto>;
  getGoalsByMonth(dto: GetGoalsByMonthDto): Promise<GoalResultDto[]>;
  getTodayGoals(dto: GetTodayGoalsDto): Promise<GoalResultDto[]>;
  getBook(dto: GetBookDto): Promise<BookResultDto>;
}

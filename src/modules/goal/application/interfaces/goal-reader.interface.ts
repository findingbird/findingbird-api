import { GetGoalsByMonthDto } from '~/modules/goal/application/dtos/get-goals-by-month.dto';

export const GOAL_READER = Symbol('IGoalReader');

export interface IGoalReader {
  getGoalsByMonth(dto: GetGoalsByMonthDto): Promise<IGoalResponseDto[]>;
}

export interface IGoalResponseDto {
  id: string;
  createdAt: string;
}

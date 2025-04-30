import { Inject, Injectable } from '@nestjs/common';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DateUtils } from '~/common/utils/Date.utils';
import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/interfaces/bird.service.interface';
import { Bird } from '~/modules/bird/domain/models/bird';
import { CreateGoalDto } from '~/modules/goal/application/dtos/create-goal.dto';
import { GetGoalByIdDto } from '~/modules/goal/application/dtos/get-goal-by-id.dto';
import { GetGoalsByDayDto } from '~/modules/goal/application/dtos/get-goals-by-day.dto';
import { GetGoalsByMonthDto } from '~/modules/goal/application/dtos/get-goals-by-month.dto';
import { GoalWithBirdDto } from '~/modules/goal/application/dtos/goal-with-bird.dto';
import { Goal } from '~/modules/goal/domain/models/goal';
import { GOAL_REPOSITORY, IGoalRepository } from '~/modules/goal/domain/repositories/goal.repository.interface';

@Injectable()
export class GoalService {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
    @Inject(BIRD_SERVICE)
    private readonly birdService: IBirdService
  ) {}

  async createGoal(dto: CreateGoalDto): Promise<GoalWithBirdDto> {
    const { userId } = dto;
    const now = DateUtils.now();
    const todayGoals = await this.goalRepository.findMany({
      userId,
      year: now.year(),
      month: now.month(),
      day: now.day(),
    });
    if (todayGoals.length > 3) {
      throw new BadRequestError(Bird.domainName, '최대 3개의 목표를 생성할 수 있습니다.');
    }

    const birds = await this.birdService.getAllBirds();

    // TODO: GPT 이용해서 새 추출하도록 수정
    const bird = birds[Math.floor(Math.random() * birds.length)];

    const goal = Goal.createNew({
      userId,
      birdId: bird.id,
    });
    await this.goalRepository.save(goal);

    return { goal, bird };
  }

  async getGoalById(dto: GetGoalByIdDto): Promise<GoalWithBirdDto> {
    const { goalId } = dto;
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new NotFoundError(Goal.domainName, goalId);
    }

    return this.getGoalWithBird(goal);
  }

  async getGoalsByMonth(dto: GetGoalsByMonthDto): Promise<GoalWithBirdDto[]> {
    const { userId, year, month } = dto;
    const goals = await this.goalRepository.findMany({ userId, year, month });

    return this.getGoalWithBird(goals);
  }

  async getTodayGoals(dto: GetGoalsByDayDto): Promise<GoalWithBirdDto[]> {
    const { userId } = dto;
    const now = DateUtils.now();
    const goals = await this.goalRepository.findMany({
      userId,
      year: now.year(),
      month: now.month(),
      day: now.day(),
    });

    return this.getGoalWithBird(goals);
  }

  // 목표에 맞는 새 가져오기
  private async getGoalWithBird(goal: Goal): Promise<GoalWithBirdDto>;
  private async getGoalWithBird(goals: Goal[]): Promise<GoalWithBirdDto[]>;
  private async getGoalWithBird(goal: Goal | Goal[]): Promise<GoalWithBirdDto | GoalWithBirdDto[]> {
    if (Array.isArray(goal)) {
      const birdIds = goal.map((g) => g.birdId);
      const birds = await this.birdService.getBirdsByIds({ birdIds });
      const birdMap = new Map<string, Bird>();
      birds.forEach((bird: Bird) => {
        birdMap.set(bird.id, bird);
      });
      return goal.map((g) => {
        const bird = birdMap.get(g.birdId);
        if (!bird) {
          throw new NotFoundError(Bird.domainName, g.birdId);
        }
        return { goal: g, bird };
      });
    }

    const bird = await this.birdService.getBirdById({ birdId: goal.birdId });
    return { goal, bird };
  }
}

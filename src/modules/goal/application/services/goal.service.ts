import { Inject, Injectable } from '@nestjs/common';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DateUtils } from '~/common/utils/Date.utils';
import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { BirdInBookDataDto, BookResultDto } from '~/modules/goal/application/dtos/book-result.dto';
import { CompleteGoalDto } from '~/modules/goal/application/dtos/complete-goal.dto';
import { CreateGoalDto } from '~/modules/goal/application/dtos/create-goal.dto';
import { GetBookDto } from '~/modules/goal/application/dtos/get-book.dto';
import { GetGoalByIdDto } from '~/modules/goal/application/dtos/get-goal-by-id.dto';
import { GetGoalsByMonthDto } from '~/modules/goal/application/dtos/get-goals-by-month.dto';
import { GetTodayGoalsDto } from '~/modules/goal/application/dtos/get-today-goals.dto';
import { GoalResultDto } from '~/modules/goal/application/dtos/goal-result.dto';
import { IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { GOAL_REPOSITORY, IGoalRepository } from '~/modules/goal/application/ports/out/goal.repository.port';
import { Goal } from '~/modules/goal/domain/models/goal';
import { BirdRecommendationService } from '~/modules/goal/domain/services/bird-recommendation.service';

@Injectable()
export class GoalService implements IGoalService {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
    @Inject(BIRD_SERVICE)
    private readonly birdService: IBirdService,
    private readonly birdRecommendationService: BirdRecommendationService
  ) {}

  async createGoal(dto: CreateGoalDto): Promise<GoalResultDto> {
    const { userId, district } = dto;
    const prevGoals = await this.goalRepository.findMany({
      userId,
    });
    const todayGoals = prevGoals.filter((goal) => {
      const now = DateUtils.now();
      const createdAt = goal.createdAt;
      return createdAt.isBetween(now.startOf('day'), now.endOf('day'));
    });
    if (todayGoals.length >= 3) {
      throw new BadRequestError(Goal.domainName, '최대 3개의 목표를 생성할 수 있습니다.');
    }

    const birds = await this.birdService.getFrequentlySeenBirds();
    const birdsInBook = birds.filter((bird) => bird.easyToFind);

    const foundedBirdIds = prevGoals.filter((goal) => goal.isCompleted).map((goal) => goal.birdId);
    const foundedBirdsInBook = birdsInBook.filter((bird) => foundedBirdIds.includes(bird.id));
    const bookCompleted = foundedBirdsInBook.length === birdsInBook.length;

    const bird = await this.birdRecommendationService.recommendBird({
      district,
      prevGoals,
      // 도감이 다 채워졌으면 모든 새로부터 추천
      // 도감이 다 채워지지 않았으면 도감에 있는 새들로부터 추천
      availableBirds: bookCompleted ? birds : birdsInBook,
    });

    const goal = Goal.createNew({
      userId,
      birdId: bird.id,
    });
    await this.goalRepository.save(goal);

    return GoalResultDto.fromDomain(goal, bird);
  }

  async completeGoal(dto: CompleteGoalDto): Promise<GoalResultDto> {
    const { userId, goalId } = dto;
    const goal = await this.goalRepository.findById(goalId);

    if (!goal) {
      throw new NotFoundError(Goal.domainName, goalId);
    }
    if (goal.userId !== userId) {
      throw new BadRequestError(Goal.domainName, '해당 목표는 다른 사용자의 목표입니다.');
    }

    goal.complete();
    await this.goalRepository.save(goal);

    const bird = await this.birdService.getBirdById({ birdId: goal.birdId });

    return GoalResultDto.fromDomain(goal, bird);
  }

  async getGoalById(dto: GetGoalByIdDto): Promise<GoalResultDto> {
    const { goalId, userId } = dto;
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new NotFoundError(Goal.domainName, goalId);
    }

    if (goal.userId !== userId) {
      throw new BadRequestError(Goal.domainName, '해당 목표는 다른 사용자의 목표입니다.');
    }

    const bird = await this.birdService.getBirdById({ birdId: goal.birdId });
    return GoalResultDto.fromDomain(goal, bird);
  }

  async getGoalsByMonth(dto: GetGoalsByMonthDto): Promise<GoalResultDto[]> {
    const { userId, year, month } = dto;
    const goals = await this.goalRepository.findMany({ userId, year, month });

    const birdIds = goals.map((goal) => goal.birdId);
    const birds = await this.birdService.getBirdsByIds({ birdIds });
    const birdMap = new Map(birds.map((bird) => [bird.id, bird]));

    return goals.map((goal) => {
      const bird = birdMap.get(goal.birdId);
      if (!bird) {
        throw new InternalServerError(Goal.domainName, `목표에 해당하는 새를 찾을 수 없습니다. 목표 ID: ${goal.id}`);
      }
      return GoalResultDto.fromDomain(goal, bird);
    });
  }

  async getTodayGoals(dto: GetTodayGoalsDto): Promise<GoalResultDto[]> {
    const { userId } = dto;
    const now = DateUtils.now();
    const year = now.year();
    const month = now.month() + 1; // month는 0부터 시작하므로 +1
    const day = now.date();
    const goals = await this.goalRepository.findMany({
      userId,
      year,
      month,
      day,
    });

    const birdIds = goals.map((goal) => goal.birdId);
    const birds = await this.birdService.getBirdsByIds({ birdIds });
    const birdMap = new Map(birds.map((bird) => [bird.id, bird]));

    return goals.map((goal) => {
      const bird = birdMap.get(goal.birdId);
      if (!bird) {
        throw new InternalServerError(Goal.domainName, `목표에 해당하는 새를 찾을 수 없습니다. 목표 ID: ${goal.id}`);
      }
      return GoalResultDto.fromDomain(goal, bird);
    });
  }

  async getBook(dto: GetBookDto): Promise<BookResultDto> {
    const { userId } = dto;
    const birdsInBook = await this.birdService.getEasyToFindBirds();
    const birdIds = birdsInBook.map((bird) => bird.id);
    const completedGoalsInBook = (await this.goalRepository.findByBirdIds(userId, birdIds)).filter(
      (goal) => goal.isCompleted
    );
    const foundedBirdIds = completedGoalsInBook.map((goal) => goal.birdId);

    const birdInBookData: BirdInBookDataDto[] = birdsInBook.map((bird) => {
      return {
        isFound: foundedBirdIds.includes(bird.id),
        bird,
      };
    });

    return {
      birds: birdInBookData,
    };
  }
}

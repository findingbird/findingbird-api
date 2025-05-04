import { Inject, Injectable } from '@nestjs/common';

import { BadRequestError } from '~/common/exceptions/BadRequestError';
import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DateUtils } from '~/common/utils/Date.utils';
import { LLMPromptDto } from '~/modules/ai/application/dtos/llm-prompt.dto';
import { AI_SERVICE, IAIService } from '~/modules/ai/application/ports/in/ai.service.port';
import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { BIRD_SERVICE, IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { Bird } from '~/modules/bird/domain/models/bird';
import { CompleteGoalDto } from '~/modules/goal/application/dtos/complete-goal.dto';
import { CreateGoalDto } from '~/modules/goal/application/dtos/create-goal.dto';
import { GetGoalByIdDto } from '~/modules/goal/application/dtos/get-goal-by-id.dto';
import { GetGoalsByMonthDto } from '~/modules/goal/application/dtos/get-goals-by-month.dto';
import { GetTodayGoalsDto } from '~/modules/goal/application/dtos/get-today-goals.dto';
import { GoalResultDto } from '~/modules/goal/application/dtos/goal-result.dto';
import { IGoalService } from '~/modules/goal/application/ports/in/goal.service.port';
import { GOAL_REPOSITORY, IGoalRepository } from '~/modules/goal/application/ports/out/goal.repository.port';
import { Goal } from '~/modules/goal/domain/models/goal';

@Injectable()
export class GoalService implements IGoalService {
  constructor(
    @Inject(GOAL_REPOSITORY)
    private readonly goalRepository: IGoalRepository,
    @Inject(BIRD_SERVICE)
    private readonly birdService: IBirdService,
    @Inject(AI_SERVICE)
    private readonly aiService: IAIService
  ) {}

  async createGoal(dto: CreateGoalDto): Promise<GoalResultDto> {
    const { userId, district } = dto;
    const now = DateUtils.now();
    const year = now.year();
    const month = now.month() + 1; // month는 0부터 시작하므로 +1
    const day = now.date();
    const todayGoals = await this.goalRepository.findMany({
      userId,
      year,
      month,
      day,
    });
    if (todayGoals.length >= 3) {
      throw new BadRequestError(Bird.domainName, '최대 3개의 목표를 생성할 수 있습니다.');
    }

    const birds = await this.birdService.getAllBirds();
    const prevGoals = await this.goalRepository.findMany({
      userId,
    });

    const prompt = this.makeRecommentPrompt(district, prevGoals, birds);
    const recommendedBirdId = (await this.aiService.getLLMResponse(prompt)).response.trim().replace(/^"|"$/g, '');
    const bird = birds.find((bird) => bird.id === recommendedBirdId);
    if (!bird) {
      throw new InternalServerError(
        Bird.domainName,
        `AI 응답으로부터 추천된 새를 찾을 수 없습니다. 다시 시도해 주시기 바랍니다. 추천된 새 ID: ${recommendedBirdId}`
      );
    }

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
    const { goalId } = dto;
    const goal = await this.goalRepository.findById(goalId);
    if (!goal) {
      throw new NotFoundError(Goal.domainName, goalId);
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

  private makeRecommentPrompt(district: string, prevGoals: Goal[], birds: BirdResultDto[]): LLMPromptDto {
    return {
      system: `너는 조류 탐사를 도와주는 전문가야. 
      사용자 위치, 계절, 출현 빈도, 서식 특성 등을 고려해 탐사하기 가장 좋은 새 하나를 골라야 해. 
      이전에 추천된 새는 가능한 피하고, 계절과 지역에 적합한 새를 우선 고려해. 
      응답은 반드시 해당 새의 **ID 값 하나만 텍스트로** 반환해야 해. 
      JSON, 배열, 설명, 문장은 절대 포함하지 마. 
      오직 ID 값만 반환해.
      추천 가능한 새 목록에 실제로 있는 새의 ID 값만 반환되어야 해.`,

      user: `다음은 추천에 필요한 정보야:
      
      - 사용자 위치: ${district}
      - 현재 날짜: ${DateUtils.now().format('YYYY-MM-DD')}
      - 이전 추천 목록: [${prevGoals.map((goal) => goal.birdId).join(', ')}]
      - 추천 가능한 새 목록:
      [
        ${birds
          .map((bird) => {
            return `{
            "ID": "${bird.id}",
            "speciesName": "${bird.speciesName}",
            "habitatType": "${bird.habitatType}",
            "appearanceCount": ${bird.appearanceCount},
            "districts": [${bird.districts.map((district) => `"${district}"`).join(', ')}],
          }`;
          })
          .join(', ')}
      ]
          
      이 중 탐사하기 가장 적합한 새 1종을 선택해서 해당 ID 값만 반환해.`,
    };
  }
}

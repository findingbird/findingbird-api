import { Inject, Injectable } from '@nestjs/common';

import { DateUtils } from '~/common/utils/Date.utils';
import { LLMRequestDto } from '~/modules/ai/application/dtos/llm-request.dto';
import { AI_SERVICE, IAIService } from '~/modules/ai/application/ports/in/ai.service.port';
import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { Goal } from '~/modules/goal/domain/models/goal';

@Injectable()
export class BirdRecommendationService {
  constructor(
    @Inject(AI_SERVICE)
    private readonly aiService: IAIService
  ) {}

  async recommendBird({
    district,
    prevGoals,
    availableBirds,
    isBookCompleted = false,
  }: {
    district: string;
    prevGoals: Goal[];
    availableBirds: BirdResultDto[];
    isBookCompleted?: boolean;
  }): Promise<BirdResultDto> {
    const prompt = this.makeRecommentPrompt(district, prevGoals, isBookCompleted ? undefined : { easy_to_find: 'Yes' });
    let bird: BirdResultDto | undefined;

    // AI 추천 로직 (최대 3회 시도)
    for (let i = 0; i < 3; i++) {
      const recommendedBirdId = (await this.aiService.getLLMResponse(prompt)).response.trim().replace(/^"|"$/g, '');
      bird = availableBirds.find((bird) => bird.id === recommendedBirdId);
      if (bird !== undefined) {
        break;
      }
    }
    if (!bird) {
      // AI 추천 실패 시 대체 로직
      bird = this.recommendFallback(
        availableBirds,
        prevGoals.map((goal) => goal.birdId)
      );
    }

    return bird;
  }

  private recommendFallback(birds: BirdResultDto[], prevGoalBirdIds: string[]): BirdResultDto {
    const availableBirds = birds.filter((bird) => !prevGoalBirdIds.includes(bird.id));
    if (availableBirds.length === 0) {
      // 모든 새가 이전 목표에 포함된 경우, 랜덤으로 선택
      return birds[Math.floor(Math.random() * availableBirds.length)];
    }

    return availableBirds[Math.floor(Math.random() * availableBirds.length)];
  }

  private makeRecommentPrompt(
    district: string,
    prevGoals: Goal[],
    retrieveFilter?: Record<string, unknown>
  ): LLMRequestDto {
    return {
      system: `너는 조류 탐사를 도와주는 전문가야. 사용자 질문에 대해 제공된 context를 바탕으로 정확하게 답변해줘.
      너는 조류 탐사에 대한 깊은 지식과 경험을 가지고 있으며, 사용자에게 가장 적합한 새를 추천하는 역할을 해.`,

      user: `
      사용자 위치, 현재날짜 및 계절, 출현 빈도, 서식 특성 등을 고려해 탐사하기 가장 좋은 새 하나를 추천해줘. 
      이전에 추천된 새는 가능한 피하고, 계절과 지역에 적합한 새를 우선 고려해.
      응답은 반드시 해당 새의 **ID 값 하나만 텍스트로** 반환해야 해. 
      JSON, 배열, 설명, 문장은 절대 포함하지 마. 
      오직 ID 값만 반환해.
      **실제로 있는 새의 ID 값**만 반환되어야 해.
      추천에 필요한 사용자 정보들은 다음과 같아:

        - 사용자 위치: ${district}
        - 현재 날짜: ${DateUtils.now().format('YYYY-MM-DD')}
        - 이전 추천된 새들의 ID 값 목록: [${prevGoals.map((goal) => goal.birdId).join(', ')}]
            
        탐사하기 가장 적합한 새 1종을 선택해서 해당 ID 값만 반환해.`,

      retrieveFilter: retrieveFilter,
    };
  }
}

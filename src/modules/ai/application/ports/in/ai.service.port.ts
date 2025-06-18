import { LLMRequestDto } from '~/modules/ai/application/dtos/llm-request.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';

export const AI_SERVICE = Symbol('IAIService');

export interface IAIService {
  getLLMResponse(request: LLMRequestDto): Promise<LLMResponseDto>;
}

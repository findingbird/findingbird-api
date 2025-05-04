import { LLMPromptDto } from '~/modules/ai/application/dtos/llm-prompt.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';

export const AI_SERVICE = Symbol('IAIService');

export interface IAIService {
  getLLMResponse(prompt: LLMPromptDto): Promise<LLMResponseDto>;
}

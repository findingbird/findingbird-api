import { LLMPrompt, LLMResponse } from '~/modules/ai/application/dtos/llm.dto';

export const LLM_CLIENT = Symbol('ILLMClient');

export interface ILLMClient {
  invoke(prompt: LLMPrompt): Promise<LLMResponse>;
}

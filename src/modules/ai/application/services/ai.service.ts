import { Inject } from '@nestjs/common';

import { LLMPromptDto } from '~/modules/ai/application/dtos/llm-prompt.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';
import { IAIService } from '~/modules/ai/application/ports/in/ai.service.port';
import { IOpenAIClient, OPENAI_CLIENT } from '~/modules/ai/application/ports/out/openai.client.port';

export class AIService implements IAIService {
  constructor(
    @Inject(OPENAI_CLIENT)
    private readonly openAIClient: IOpenAIClient
  ) {}

  async getLLMResponse(prompt: LLMPromptDto): Promise<LLMResponseDto> {
    const { system, user, options } = prompt;
    const messages: Array<{
      role: 'user' | 'assistant' | 'system';
      content: string;
    }> = [];
    if (system) {
      messages.push({ role: 'system', content: system });
    }
    messages.push({ role: 'user', content: user });
    const completion = await this.openAIClient.invoke({
      model: options?.model ?? 'gpt-3.5-turbo',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 1024,
    });
    const response = completion.result;
    return { response };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { LLMPrompt, LLMResponse } from '~/modules/ai/application/dtos/llm.dto';
import { ILLMClient } from '~/modules/ai/application/interfaces/llm-client.interface';

@Injectable()
export class OpenAIClient implements ILLMClient {
  private readonly api: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.api = new OpenAI({
      apiKey: apiKey,
    });
  }

  async invoke(prompt: LLMPrompt): Promise<LLMResponse> {
    const { system, user, options } = prompt;
    const messages: ChatCompletionMessageParam[] = [];
    if (system) {
      messages.push({ role: 'system', content: system });
    }
    messages.push({ role: 'user', content: user });
    const completion = await this.api.chat.completions.create({
      model: options?.model ?? 'gpt-3.5-turbo',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: 1024,
    });
    const response = completion.choices[0].message.content;
    if (response === null) {
      throw new InternalServerError('AI', 'AI 응답 생성에 실패하였습니다.');
    }
    return { response };
  }
}

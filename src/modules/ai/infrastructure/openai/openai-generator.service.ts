import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { LLMRequestDto } from '~/modules/ai/application/dtos/llm-request.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';
import { IGeneratorService } from '~/modules/ai/application/ports/out/generator.service.port';

@Injectable()
export class OpenAIGeneratorService implements IGeneratorService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async generateResponse(request: LLMRequestDto, documents: string[]): Promise<LLMResponseDto> {
    const { system, user, options } = request;
    const context = documents.map((doc, i) => `Bird ${i + 1}:\n${doc}`).join('\n\n');
    const messages: ChatCompletionMessageParam[] = [];
    if (system) {
      messages.push({ role: 'system', content: system });
    }
    messages.push({ role: 'user', content: user });
    messages.push({ role: 'assistant', content: context });
    const completion = await this.openai.chat.completions.create({
      model: options?.model ?? 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.2,
    });
    const response = completion.choices[0].message.content;
    if (response === null) {
      throw new InternalServerError('AI', 'AI 응답 생성에 실패하였습니다.');
    }
    return { response };
  }
}

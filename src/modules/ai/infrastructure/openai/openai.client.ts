import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { InternalServerError } from '~/common/exceptions/InternelServerError';
import { OpenAIParamDto } from '~/modules/ai/application/dtos/openai-param.dto';
import { OpenAIResultDto } from '~/modules/ai/application/dtos/openai-result.dto';
import { IOpenAIClient } from '~/modules/ai/application/ports/out/openai.client.port';

@Injectable()
export class OpenAIClient implements IOpenAIClient {
  private readonly api: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.api = new OpenAI({
      apiKey: apiKey,
    });
  }

  async invoke(params: OpenAIParamDto): Promise<OpenAIResultDto> {
    const { model, messages, temperature, max_tokens } = params;
    const completion = await this.api.chat.completions.create({
      model: model,
      messages,
      temperature: temperature ?? 0.7,
      max_tokens: max_tokens ?? 1024,
    });
    const result = completion.choices[0].message.content;
    if (result === null) {
      throw new InternalServerError('AI', 'AI 응답 생성에 실패하였습니다.');
    }
    return { result };
  }
}

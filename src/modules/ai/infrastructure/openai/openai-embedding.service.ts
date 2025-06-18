import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { IEmbeddingService } from '~/modules/ai/application/ports/out/embedding.service.port';

@Injectable()
export class OpenAIEmbeddingService implements IEmbeddingService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async embedText(text: string): Promise<number[]> {
    const res = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return res.data[0].embedding || [];
  }
}

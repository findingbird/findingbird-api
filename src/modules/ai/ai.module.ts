import { Module } from '@nestjs/common';

import { LLM_CLIENT } from '~/modules/ai/application/interfaces/llm-client.interface';
import { OpenAIClient } from '~/modules/ai/infrastructure/openai/openai.client';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LLM_CLIENT,
      useClass: OpenAIClient,
    },
  ],
  exports: [LLM_CLIENT],
})
export class AiModule {}

import { Module } from '@nestjs/common';

import { AI_SERVICE } from '~/modules/ai/application/ports/in/ai.service.port';
import { OPENAI_CLIENT } from '~/modules/ai/application/ports/out/openai.client.port';
import { AIService } from '~/modules/ai/application/services/ai.service';
import { OpenAIClient } from '~/modules/ai/infrastructure/openai/openai.client';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: AI_SERVICE,
      useClass: AIService,
    },
    {
      provide: OPENAI_CLIENT,
      useClass: OpenAIClient,
    },
  ],
  exports: [AI_SERVICE],
})
export class AiModule {}

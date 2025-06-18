import { Module } from '@nestjs/common';

import { AI_SERVICE } from '~/modules/ai/application/ports/in/ai.service.port';
import { EMBEDDING_SERVICE } from '~/modules/ai/application/ports/out/embedding.service.port';
import { GENERATOR_SERVICE } from '~/modules/ai/application/ports/out/generator.service.port';
import { RETRIEVER_SERVICE } from '~/modules/ai/application/ports/out/retriever.service.port';
import { AIService } from '~/modules/ai/application/services/ai.service';
import { OpenAIEmbeddingService } from '~/modules/ai/infrastructure/openai/openai-embedding.service';
import { OpenAIGeneratorService } from '~/modules/ai/infrastructure/openai/openai-generator.service';
import { PineconeRetrieverService } from '~/modules/ai/infrastructure/pinecone/pinecone-retriever.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: AI_SERVICE,
      useClass: AIService,
    },
    {
      provide: EMBEDDING_SERVICE,
      useClass: OpenAIEmbeddingService,
    },
    {
      provide: RETRIEVER_SERVICE,
      useClass: PineconeRetrieverService,
    },
    {
      provide: GENERATOR_SERVICE,
      useClass: OpenAIGeneratorService,
    },
  ],
  exports: [AI_SERVICE],
})
export class AiModule {}

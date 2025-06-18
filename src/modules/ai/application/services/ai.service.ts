import { Inject } from '@nestjs/common';

import { LLMRequestDto } from '~/modules/ai/application/dtos/llm-request.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';
import { IAIService } from '~/modules/ai/application/ports/in/ai.service.port';
import { EMBEDDING_SERVICE, IEmbeddingService } from '~/modules/ai/application/ports/out/embedding.service.port';
import { GENERATOR_SERVICE, IGeneratorService } from '~/modules/ai/application/ports/out/generator.service.port';
import { IRetrieverService, RETRIEVER_SERVICE } from '~/modules/ai/application/ports/out/retriever.service.port';

export class AIService implements IAIService {
  constructor(
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingService: IEmbeddingService,
    @Inject(RETRIEVER_SERVICE)
    private readonly retrieverService: IRetrieverService,
    @Inject(GENERATOR_SERVICE)
    private readonly generatorService: IGeneratorService
  ) {}

  async getLLMResponse(request: LLMRequestDto): Promise<LLMResponseDto> {
    const embedding = await this.embeddingService.embedText(request.user);
    const documents = await this.retrieverService.retrieve(embedding, request.retrieveFilter, 10);
    const response = await this.generatorService.generateResponse(request, documents);
    return response;
  }
}

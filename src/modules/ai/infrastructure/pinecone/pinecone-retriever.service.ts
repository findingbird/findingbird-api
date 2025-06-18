import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Index, Pinecone } from '@pinecone-database/pinecone';

import { IRetrieverService } from '~/modules/ai/application/ports/out/retriever.service.port';

@Injectable()
export class PineconeRetrieverService implements IRetrieverService {
  private readonly pinecone: Pinecone;
  private readonly index: Index;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('PINECONE_API_KEY');
    const indexName = this.configService.getOrThrow<string>('PINECONE_INDEX_NAME');
    this.pinecone = new Pinecone({
      apiKey: apiKey,
    });
    this.index = this.pinecone.Index(indexName);
  }

  async retrieve(vector: number[], filter?: Record<string, unknown>, topK = 10): Promise<string[]> {
    const result = await this.index.query({
      vector,
      topK,
      includeMetadata: true,
      filter,
    });

    return result.matches?.map((match) => match.metadata?.text as string).filter(Boolean) ?? [];
  }
}

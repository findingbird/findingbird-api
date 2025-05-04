export class OpenAIParamDto {
  readonly model: string;
  readonly messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  readonly temperature?: number;
  readonly max_tokens?: number;
}

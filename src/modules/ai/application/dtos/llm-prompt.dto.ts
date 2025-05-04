export class LLMPromptDto {
  // 시스템 역할
  readonly system?: string;

  // 사용자 입력
  readonly user: string;

  readonly options?: {
    readonly model?: string;
    readonly temperature?: number;
    readonly max_tokens?: number;
  };
}

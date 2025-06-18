export class LLMRequestDto {
  // 시스템 역할
  readonly system?: string;

  // 사용자 입력
  readonly user: string;

  // AI가 문서를 필터링하기 위한 조건
  readonly retrieveFilter?: Record<string, unknown>;

  readonly options?: {
    readonly model?: string;
    readonly temperature?: number;
  };
}

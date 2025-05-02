export class LLMPrompt {
  // 시스템 역할
  system?: string;

  // 사용자 입력
  user: string;

  options?: {
    model?: string;
    temperature?: number;
  };
}

export class LLMResponse {
  response: string;
}

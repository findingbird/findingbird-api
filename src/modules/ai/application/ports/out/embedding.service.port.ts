export const EMBEDDING_SERVICE = Symbol('IEmbeddingService');

export interface IEmbeddingService {
  /**
   * 주어진 텍스트를 OpenAI 임베딩 벡터로 변환
   * @param text 사용자 질문이나 문서 문자열
   * @returns number[] 벡터 배열
   */
  embedText(text: string): Promise<number[]>;
}

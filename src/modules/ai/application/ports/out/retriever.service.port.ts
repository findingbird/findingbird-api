export const RETRIEVER_SERVICE = Symbol('IRetrieverService');

export interface IRetrieverService {
  /**
   * 벡터를 기반으로 문서 검색
   * @param vector 임베딩 벡터
   * @param filter 검색 필터 (선택 사항)
   * @param topK 검색할 결과 수 (기본 10개)
   * @returns 텍스트 기반 문서 배열
   */
  retrieve(vector: number[], filter?: Record<string, unknown>, topK?: number): Promise<string[]>;
}

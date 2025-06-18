import { LLMRequestDto } from '~/modules/ai/application/dtos/llm-request.dto';
import { LLMResponseDto } from '~/modules/ai/application/dtos/llm-response.dto';

export const GENERATOR_SERVICE = Symbol('IGeneratorService');

export interface IGeneratorService {
  /**
   * 주어진 프롬프트에 대해 LLM 응답을 생성
   * @param request LLM 프롬프트 DTO
   * @param documents 검색된 문서 배열
   * @returns LLM 응답 DTO
   */
  generateResponse(request: LLMRequestDto, documents: string[]): Promise<LLMResponseDto>;
}

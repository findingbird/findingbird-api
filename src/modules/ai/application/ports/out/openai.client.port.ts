import { OpenAIParamDto } from '~/modules/ai/application/dtos/openai-param.dto';
import { OpenAIResultDto } from '~/modules/ai/application/dtos/openai-result.dto';

export const OPENAI_CLIENT = Symbol('IOpenAIClient');

export interface IOpenAIClient {
  invoke(params: OpenAIParamDto): Promise<OpenAIResultDto>;
}

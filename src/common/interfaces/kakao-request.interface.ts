import { Request } from 'express';

import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';

export interface KakaoRequest extends Request {
  user: KakaoLoginDto;
}

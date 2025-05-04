import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { RefreshTokenDto } from '~/modules/auth/application/dtos/refresh-token.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';

export const AUTH_SERVICE = Symbol('IAuthService');

export interface IAuthService {
  kakaoLogin(dto: KakaoLoginDto): Promise<TokenDto>;
  refreshToken(dto: RefreshTokenDto): Promise<TokenDto>;
}

import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { RefreshTokenDto } from '~/modules/auth/application/dtos/refresh-token.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { JwtPayload } from '~/modules/auth/application/interfaces/jwt-payload.interface';

export const AUTH_SERVICE = Symbol('IAuthService');

export interface IAuthService {
  kakaoLogin(dto: KakaoLoginDto): Promise<TokenDto>;
  validateAccessToken(dto: JwtPayload): Promise<JwtPayload>;
  refreshToken(dto: RefreshTokenDto): Promise<TokenDto>;
}

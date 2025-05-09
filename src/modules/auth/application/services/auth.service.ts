import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { UnauthorizedError } from '~/common/exceptions/UnauthorizedError';
import { DateUtils } from '~/common/utils/Date.utils';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { RefreshTokenDto } from '~/modules/auth/application/dtos/refresh-token.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { JwtPayload } from '~/modules/auth/application/interfaces/jwt-payload.interface';
import { AUTH_REPOSITORY, IAuthRepository } from '~/modules/auth/application/ports/out/auth.repository.port';
import { Auth } from '~/modules/auth/domain/models/auth';
import { IUserService, USER_SERVICE } from '~/modules/user/application/ports/in/user.service.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(USER_SERVICE)
    private readonly userService: IUserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async kakaoLogin(dto: KakaoLoginDto): Promise<TokenDto> {
    const { kakaoId } = dto;
    let auth = await this.authRepository.findByKakaoId(kakaoId);
    if (!auth) {
      // 사용자가 없으면 새로 생성
      const user = await this.userService.createUser();
      auth = Auth.createNew({ userId: user.userId, kakaoId });
      await this.authRepository.save(auth);
    }
    const token = this.generateToken(auth);
    auth.saveRefreshToken(
      token.refreshToken,
      DateUtils.now().add(this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30, 'd')
    );
    await this.authRepository.save(auth);

    return token;
  }

  async validateAccessToken(dto: JwtPayload): Promise<JwtPayload> {
    const { userId } = dto;
    const auth = await this.authRepository.findByUserId(userId);
    if (!auth) {
      throw new UnauthorizedError(Auth.domainName, '사용자를 찾을 수 없습니다.');
    }
    return dto;
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenDto> {
    const { userId, refreshToken } = dto;
    const auth = await this.authRepository.findByUserId(userId);
    if (!auth) {
      throw new NotFoundError(Auth.domainName, '사용자를 찾을 수 없습니다.');
    }
    auth.verifyRefreshToken(refreshToken);
    const token = this.generateToken(auth);
    auth.saveRefreshToken(
      token.refreshToken,
      DateUtils.now().add(this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30, 'd')
    );
    await this.authRepository.save(auth);

    return token;
  }

  private generateToken(auth: Auth): TokenDto {
    const accessToken = this.generateAccessToken(auth.userId, auth.kakaoId);
    const refreshToken = this.generateRefreshToken(auth.userId, auth.kakaoId);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string, kakaoId: string): string {
    const payload: JwtPayload = { userId, kakaoId };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('NODE_ENV') === 'development' ? '1h' : '15m',
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private generateRefreshToken(userId: string, kakaoId: string): string {
    const payload: JwtPayload = { userId, kakaoId };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('NODE_ENV') === 'development' ? '7d' : '30d',
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}

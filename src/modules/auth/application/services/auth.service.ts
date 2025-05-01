import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { DateUtils } from '~/common/utils/Date.utils';
import { CreateAuthDto } from '~/modules/auth/application/dtos/create-auth.dto';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { RefreshTokenDto } from '~/modules/auth/application/dtos/refresh-token.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { JwtPayload } from '~/modules/auth/application/interfaces/jwt-payload.interface';
import { Auth } from '~/modules/auth/domain/models/auth';
import { AUTH_REPOSITORY, IAuthRepository } from '~/modules/auth/domain/repositories/auth.repository.interface';
import { IUserPersister, USER_PERSISTER } from '~/modules/user/application/interfaces/user-persister.interface';

@Injectable()
export class AuthService {
  public accessExpiresInSecond: number;
  public refreshExpiresInSecond: number;

  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    @Inject(USER_PERSISTER)
    private readonly userPersister: IUserPersister,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.accessExpiresInSecond = (this.configService.get<string>('NODE_ENV') === 'development' ? 60 : 15) * 60; // 1시간 or 15분
    this.refreshExpiresInSecond =
      (this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30) * 24 * 60 * 60; // 7일 or 30일
  }

  async kakaoLogin(dto: KakaoLoginDto): Promise<TokenDto> {
    const { kakaoId } = dto;
    let auth = await this.authRepository.findByKakaoId(kakaoId);
    if (!auth) {
      // 사용자가 없으면 새로 생성
      const user = await this.userPersister.createUser();
      auth = await this.createAuth({ userId: user.userId, kakaoId });
    }
    const token = this.generateToken(auth);
    auth.saveRefreshToken(token.refreshToken, DateUtils.now().add(this.refreshExpiresInSecond, 'second'));
    await this.authRepository.save(auth);

    return token;
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenDto> {
    const { userId, refreshToken } = dto;
    const auth = await this.authRepository.findByUserId(userId);
    if (!auth) {
      throw new NotFoundError(Auth.domainName);
    }
    auth.verifyRefreshToken(refreshToken);
    const token = this.generateToken(auth);
    auth.saveRefreshToken(token.refreshToken, DateUtils.now().add(this.refreshExpiresInSecond, 'second'));
    await this.authRepository.save(auth);

    return token;
  }

  async createAuth(dto: CreateAuthDto): Promise<Auth> {
    const { userId, kakaoId } = dto;
    const auth = Auth.createNew({ userId, kakaoId });
    await this.authRepository.save(auth);
    return auth;
  }

  private generateToken(auth: Auth): TokenDto {
    const accessToken = this.generateAccessToken(auth.userId, auth.kakaoId);
    const refreshToken = this.generateRefreshToken(auth.userId, auth.kakaoId);

    return { accessToken, refreshToken };
  }

  private generateAccessToken(userId: string, kakaoId: string): string {
    const payload: JwtPayload = { userId, kakaoId };
    return this.jwtService.sign(payload, {
      expiresIn: this.accessExpiresInSecond,
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private generateRefreshToken(userId: string, kakaoId: string): string {
    const payload: JwtPayload = { userId, kakaoId };
    return this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresInSecond,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}

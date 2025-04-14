import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DateUtils } from '~/common/utils/Date.utils';
import { CreateAuthDto } from '~/modules/auth/application/dtos/create-auth.dto';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { JwtPayload } from '~/modules/auth/application/interfaces/jwt-payload.interface';
import { Auth } from '~/modules/auth/domain/models/auth';
import { AUTH_REPOSITORY, IAuthRepository } from '~/modules/auth/domain/repositories/auth.repository.interface';
import { UserService } from '~/modules/user/application/services/user.service';

@Injectable()
export class AuthService {
  private accessExpiresIn: number;
  private refreshExpiresIn: number;

  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.accessExpiresIn = (this.configService.get<string>('NODE_ENV') === 'development' ? 60 : 15) * 60; // 1시간 or 15분
    this.refreshExpiresIn = (this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30) * 24 * 60 * 60; // 7일 or 30일
  }

  async kakaoLogin(dto: KakaoLoginDto): Promise<TokenDto> {
    let auth = await this.authRepository.findByKakaoId(dto.kakaoId);
    if (!auth) {
      // 사용자가 없으면 새로 생성
      const user = await this.userService.createUser();
      auth = await this.createAuth({ userId: user.id, kakaoId: dto.kakaoId });
    }
    const token = this.generateToken(auth);
    auth.saveRefreshToken(token.refreshToken, DateUtils.now().add(this.refreshExpiresIn, 'second'));
    await this.authRepository.save(auth);

    return token;
  }

  async createAuth(dto: CreateAuthDto): Promise<Auth> {
    const auth = Auth.createNew({ userId: dto.userId, kakaoId: dto.kakaoId });
    await this.authRepository.save(auth);
    return auth;
  }

  private generateToken(auth: Auth): TokenDto {
    const payload: JwtPayload = { userId: auth.userId, kakaoId: auth.kakaoId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessExpiresIn,
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiresIn,
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    return { accessToken, refreshToken };
  }
}

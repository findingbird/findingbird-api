import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Profile, Strategy } from 'passport-kakao';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('KAKAO_CLIENT_ID'),
      callbackURL: configService.getOrThrow<string>('KAKAO_REDIRECT_URL'),
    });
  }

  authenticate(req: Request, options?: KakaoAuthOptions): void {
    // Kakao에서 state parameter를 사용하여 요청 context를 보존합니다.
    // 이 값을 사용하여 로그인 후 redirect URL을 결정할 수 있습니다.
    const authOptions = options !== undefined ? options : ({} as KakaoAuthOptions);
    authOptions.state = (req.query.callback as string) || undefined;
    super.authenticate(req, authOptions);
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile): KakaoLoginDto {
    if (!profile.id) {
      throw new NotFoundError('Kakao profile');
    }

    return { kakaoId: profile.id };
  }
}

interface KakaoAuthOptions {
  state?: string;
  [key: string]: unknown;
}

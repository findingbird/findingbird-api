import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
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

  validate(_accessToken: string, _refreshToken: string, profile: Profile): KakaoLoginDto {
    if (!profile.id) {
      throw new NotFoundError('Kakao profile');
    }

    return { kakaoId: profile.id };
  }
}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { AuthService } from '~/modules/auth/application/services/auth.service';
import { KakaoRequest } from '~/modules/auth/presentation/interfaces/kakao-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin(): Promise<void> {
    // redirect to kakao login page
  }

  @Get('/kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLoginRedirect(@Req() req: KakaoRequest): Promise<TokenDto> {
    const kakaoLoginDto: KakaoLoginDto = req.user;
    const token = await this.authService.kakaoLogin(kakaoLoginDto);
    return token;
  }
}

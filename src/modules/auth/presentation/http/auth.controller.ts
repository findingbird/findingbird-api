import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtRefreshGuard } from '~/common/guards/jwt-refresh-guard';
import { KakaoRequest } from '~/common/interfaces/kakao-request.interface';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { TokenDto } from '~/modules/auth/application/dtos/token.dto';
import { AuthService } from '~/modules/auth/application/services/auth.service';

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

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Req() req: UserRequest): Promise<TokenDto> {
    const refreshToken = req.cookies['refresh-token'];
    const userId = req.user.userId;
    const token = await this.authService.refreshToken(userId, refreshToken);
    return token;
  }
}

// TODO: 토큰 쿠키에 담기

import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { JwtRefreshGuard } from '~/common/guards/jwt-refresh-guard';
import { KakaoRequest } from '~/common/interfaces/kakao-request.interface';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { AccessTokenDto } from '~/modules/auth/application/dtos/token.dto';
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
  async kakaoLoginRedirect(
    @Req() req: KakaoRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<AccessTokenDto> {
    const kakaoLoginDto: KakaoLoginDto = req.user;
    const token = await this.authService.kakaoLogin(kakaoLoginDto);
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.authService.refreshExpiresInSecond * 1000,
    });
    return { accessToken: token.accessToken };
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response): Promise<AccessTokenDto> {
    const refreshToken = req.cookies['refresh-token'];
    const userId = req.user.userId;
    const token = await this.authService.refreshToken(userId, refreshToken);
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.authService.refreshExpiresInSecond * 1000,
    });
    return { accessToken: token.accessToken };
  }
}

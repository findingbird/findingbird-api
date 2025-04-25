import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtRefreshGuard } from '~/common/guards/jwt-refresh-guard';
import { KakaoRequest } from '~/common/interfaces/kakao-request.interface';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { AuthService } from '~/modules/auth/application/services/auth.service';
import { TokenResponseDto } from '~/modules/auth/presentation/http/dtos/token.response';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인',
    description: '자동으로 카카오 로그인 페이지로 redirect 됩니다. (Swagger 상에서는 동작하지 않습니다.)',
  })
  @ApiResponse({
    status: 302,
    description: '카카오 로그인 페이지로 redirect 됩니다.',
  })
  async kakaoLogin(): Promise<void> {
    // redirect to kakao login page
  }

  @Get('/kakao/redirect')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인 후 자동 redirect 되는 url',
    description:
      '카카오 서버에서 응답을 보내는 엔드포인트 입니다. 클라이언트 단에서 요청하지 않습니다. 클라이언트의 callback url로 redirect 됩니다',
  })
  @ApiResponse({
    status: 302,
    description:
      'access token은 URL query, refresh token은 cookie에 포함되어 있습니다. (https 가 활성화되어야 합니다.)',
  })
  async kakaoLoginRedirect(@Req() req: KakaoRequest, @Res() res: Response): Promise<void> {
    const kakaoLoginDto: KakaoLoginDto = req.user;
    const token = await this.authService.kakaoLogin(kakaoLoginDto);
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.authService.refreshExpiresInSecond * 1000,
    });
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    // TODO: client redirect URL 확인 및 수정"
    const redirectUrl = `${clientUrl}/auth/callback?accessToken=${token.accessToken}`;
    return res.redirect(redirectUrl);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Token 재발급',
    description: 'refresh token을 쿠키에서 가져와 access token, refresh token을 재발급합니다. 기존 토큰은 만료됩니다.',
  })
  @ApiResponse({
    status: 200,
    description:
      'access token은 response body, refresh token은 cookie에 포함되어 있습니다. (https 가 활성화되어야 합니다.)',
    type: TokenResponseDto,
  })
  async refreshToken(@Req() req: UserRequest, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    const refreshToken = req.cookies['refresh-token'];
    const userId = req.user.userId;
    const refreshTokenDto = { userId, refreshToken };
    const token = await this.authService.refreshToken(refreshTokenDto);
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.authService.refreshExpiresInSecond * 1000,
    });
    return { accessToken: token.accessToken };
  }
}

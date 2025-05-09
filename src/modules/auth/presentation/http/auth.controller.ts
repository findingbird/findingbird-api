import { Controller, Get, Inject, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtRefreshGuard } from '~/common/guards/jwt-refresh-guard';
import { KakaoRequest } from '~/common/interfaces/kakao-request.interface';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { KakaoLoginDto } from '~/modules/auth/application/dtos/kakao-login.dto';
import { AUTH_SERVICE, IAuthService } from '~/modules/auth/application/ports/in/auth.service.port';
import { TokenResponseDto } from '~/modules/auth/presentation/http/dtos/token.response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({
    summary: '카카오 로그인',
    description: '자동으로 카카오 로그인 페이지로 redirect 됩니다. (Swagger 상에서는 동작하지 않습니다.)',
  })
  @ApiQuery({
    name: 'callback',
    description: '카카오 로그인 후 redirect 될 URL입니다. (default: http://localhost:3000/auth/callback)',
    required: false,
  })
  @ApiResponse({
    status: 302,
    description: '카카오 로그인 페이지로 redirect 됩니다.',
  })
  async kakaoLogin(@Query('callback') _callback: string): Promise<void> {
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
  async kakaoLoginRedirect(
    @Req() req: KakaoRequest,
    @Res() res: Response,
    @Query('state') state: string
  ): Promise<void> {
    const kakaoLoginDto: KakaoLoginDto = req.user;
    const token = await this.authService.kakaoLogin(kakaoLoginDto);
    res.cookie('refresh-token', token.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: (this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30) * 24 * 60 * 60 * 1000,
    });
    const callbackUrl = state
      ? `${state}?accessToken=${token.accessToken}`
      : `${this.configService.get<string>('CLIENT_URL')}/auth/callback?accessToken=${token.accessToken}`;
    return res.redirect(callbackUrl);
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
      maxAge: (this.configService.get<string>('NODE_ENV') === 'development' ? 7 : 30) * 24 * 60 * 60 * 1000,
    });
    return { accessToken: token.accessToken };
  }
}

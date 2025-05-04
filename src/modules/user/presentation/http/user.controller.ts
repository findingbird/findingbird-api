import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { DateUtils } from '~/common/utils/Date.utils';
import { IUserService, USER_SERVICE } from '~/modules/user/application/ports/in/user.service.port';
import { UserResponseDto } from '~/modules/user/presentation/http/dtos/user.response.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: IUserService
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 조회 성공',
    type: UserResponseDto,
  })
  async getUserById(@Req() req: UserRequest): Promise<UserResponseDto> {
    const userId = req.user.userId;
    const user = await this.userService.getUserById({ userId });
    return {
      id: user.userId,
      nickname: user.nickname,
      createdAt: DateUtils.format(user.createdAt),
    };
  }
}

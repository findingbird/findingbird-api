import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { DateUtils } from '~/common/utils/Date.utils';
import { UserService } from '~/modules/user/application/services/user.service';
import { UserResponseDto } from '~/modules/user/presentation/http/dtos/user.response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      id: user.id,
      nickname: user.nickname,
      createdAt: DateUtils.format(user.createdAt),
    };
  }
}

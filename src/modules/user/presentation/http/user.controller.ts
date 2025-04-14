import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '~/common/guards/jwt-auth-guard';
import { UserRequest } from '~/common/interfaces/user-request.interface';
import { UserService } from '~/modules/user/application/services/user.service';
import { User } from '~/modules/user/domain/models/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Req() req: UserRequest): Promise<User> {
    const userId = req.user.userId;
    return await this.userService.getUserById({ userId });
  }
}

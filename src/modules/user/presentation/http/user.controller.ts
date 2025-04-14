import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from '~/modules/user/application/services/user.service';
import { User } from '~/modules/user/domain/models/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return await this.userService.getUserById({ userId: id });
  }
}

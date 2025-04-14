import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { FindUserByIdDto } from '~/modules/user/application/dtos/find-user.dto';
import { User } from '~/modules/user/domain/models/user';
import { IUserRepository, USER_REPOSITORY } from '~/modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async createUser(): Promise<User> {
    const user = User.createNew({});
    await this.userRepository.save(user);
    return user;
  }

  async getUserById(dto: FindUserByIdDto): Promise<User> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new NotFoundError(User.domainName, dto.userId);
    }
    return user;
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { GetUserByIdDto } from '~/modules/user/application/dtos/get-user-by-id.dto';
import { UserResponseDto } from '~/modules/user/application/dtos/user.response.dto';
import { IUserPersister } from '~/modules/user/application/interfaces/user-persister.interface';
import { User } from '~/modules/user/domain/models/user';
import { IUserRepository, USER_REPOSITORY } from '~/modules/user/domain/repositories/user.repository.interface';

@Injectable()
export class UserService implements IUserPersister {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async createUser(): Promise<UserResponseDto> {
    const user = User.createNew({});
    await this.userRepository.save(user);
    return UserResponseDto.fromDomain(user);
  }

  async getUserById(dto: GetUserByIdDto): Promise<User> {
    const { userId } = dto;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(User.domainName, userId);
    }
    return user;
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import {
  IOnboardingService,
  ONBOARDING_SERVICE,
} from '~/modules/onboarding/application/ports/in/onboarding.service.port';
import { GetUserByIdDto } from '~/modules/user/application/dtos/get-user-by-id.dto';
import { getUsersByIdsDto } from '~/modules/user/application/dtos/get-users-by-ids.dto';
import { UserResultDto } from '~/modules/user/application/dtos/user-result.dto';
import { IUserService } from '~/modules/user/application/ports/in/user.service.port';
import { IUserRepository, USER_REPOSITORY } from '~/modules/user/application/ports/out/user.repository.port';
import { User } from '~/modules/user/domain/models/user';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(ONBOARDING_SERVICE)
    private readonly onboardingService: IOnboardingService
  ) {}

  async createUser(): Promise<UserResultDto> {
    const user = User.createNew({});
    await this.userRepository.save(user);
    await this.onboardingService.onboarding({ userId: user.id });
    return UserResultDto.fromDomain(user);
  }

  async getUserById(dto: GetUserByIdDto): Promise<UserResultDto> {
    const { userId } = dto;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(User.domainName, userId);
    }
    return UserResultDto.fromDomain(user);
  }

  async getUsersByIds(dto: getUsersByIdsDto): Promise<UserResultDto[]> {
    const { userIds } = dto;
    const uniqueUserIds = [...new Set(userIds)];
    const users = await this.userRepository.findByIds(uniqueUserIds);
    if (users.length !== uniqueUserIds.length) {
      const notFoundUserIds = uniqueUserIds.filter((userId) => !users.some((user) => user.id === userId));
      throw new NotFoundError(User.domainName, notFoundUserIds.join(', '));
    }
    return users.map((user) => UserResultDto.fromDomain(user));
  }
}

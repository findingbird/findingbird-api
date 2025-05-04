import { Dayjs } from 'dayjs';

import { User } from '~/modules/user/domain/models/user';

export class UserResultDto {
  readonly userId: string;
  readonly nickname: string;
  readonly createdAt: Dayjs;

  static fromDomain(user: User): UserResultDto {
    return {
      userId: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt,
    };
  }
}

import { IUserResponseDto } from '~/modules/user/application/interfaces/user-persister.interface';
import { User } from '~/modules/user/domain/models/user';

export class UserResponseDto implements IUserResponseDto {
  userId: string;
  nickname: string;

  static fromDomain(user: User): UserResponseDto {
    return {
      userId: user.id,
      nickname: user.nickname,
    };
  }
}

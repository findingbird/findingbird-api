import { GetUserByIdDto } from '~/modules/user/application/dtos/get-user-by-id.dto';
import { getUsersByIdsDto } from '~/modules/user/application/dtos/get-users-by-ids.dto';
import { UserResultDto } from '~/modules/user/application/dtos/user-result.dto';

export const USER_SERVICE = Symbol('IUserService');

export interface IUserService {
  createUser(): Promise<UserResultDto>;
  getUserById(dto: GetUserByIdDto): Promise<UserResultDto>;
  getUsersByIds(dto: getUsersByIdsDto): Promise<UserResultDto[]>;
}

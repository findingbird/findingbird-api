import { User } from '~/modules/user/domain/models/user';

export const USER_REPOSITORY = Symbol('IUserRepository');

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  save(users: User[]): Promise<void>;
}

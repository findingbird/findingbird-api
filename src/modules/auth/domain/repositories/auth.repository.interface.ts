import { Auth } from '~/modules/auth/domain/models/auth';

export const AUTH_REPOSITORY = Symbol('IAuthRepository');

export interface IAuthRepository {
  findByKakaoId(kakaoId: string): Promise<Auth | null>;
  findByUserId(userId: string): Promise<Auth | null>;
  save(user: Auth): Promise<void>;
  save(users: Auth[]): Promise<void>;
}

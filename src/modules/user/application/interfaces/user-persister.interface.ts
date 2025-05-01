export const USER_PERSISTER = Symbol('IUserPersister');

export interface IUserPersister {
  createUser(): Promise<IUserResponseDto>;
}

export interface IUserResponseDto {
  userId: string;
  nickname: string;
}

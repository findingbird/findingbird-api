import { DateUtils } from '~/common/utils/Date.utils';
import { User, UserProps } from '~/modules/user/domain/models/user';
import { UserEntity } from '~/modules/user/infrastructure/entities/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    const userProps: UserProps = {
      nickname: entity.nickname,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return User.create(entity.id, userProps);
  }

  static toDomains(entities: UserEntity[]): User[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(user: User): UserEntity {
    const userEntity = new UserEntity();

    userEntity.id = user.id;
    userEntity.nickname = user.nickname;

    userEntity.createdAt = DateUtils.toUtcDate(user.createdAt);
    userEntity.updatedAt = DateUtils.toUtcDate(user.updatedAt);
    userEntity.deletedAt = user.deletedAt ? DateUtils.toUtcDate(user.deletedAt) : null;

    return userEntity;
  }

  static toEntities(users: User[]): UserEntity[] {
    if (users.length === 0) return [];

    return users.map((user) => this.toEntity(user));
  }
}

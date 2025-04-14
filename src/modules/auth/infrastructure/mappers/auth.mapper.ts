import { DateUtils } from '~/common/utils/Date.utils';
import { Auth, AuthProps } from '~/modules/auth/domain/models/auth';
import { AuthEntity } from '~/modules/auth/infrastructure/entities/auth.entity';
import { RefreshTokenMapper } from '~/modules/auth/infrastructure/mappers/refreshToken.mapper';

export class AuthMapper {
  static toDomain(entity: AuthEntity): Auth {
    const authProps: AuthProps = {
      kakaoId: entity.kakaoId,
      userId: entity.userId,
      refreshTokens: RefreshTokenMapper.toDomains(entity.refreshTokens),
      lastLoginAt: DateUtils.toKst(entity.lastLoginAt),
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Auth.create(entity.id, authProps);
  }

  static toDomains(entities: AuthEntity[]): Auth[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(auth: Auth): AuthEntity {
    const authEntity = new AuthEntity();

    authEntity.id = auth.id;
    authEntity.kakaoId = auth.kakaoId;
    authEntity.userId = auth.userId;
    authEntity.lastLoginAt = DateUtils.toUtcDate(auth.lastLoginAt);
    const refreshTokenEntities = RefreshTokenMapper.toEntities(auth.props.refreshTokens);
    refreshTokenEntities.forEach((tokenEntity) => {
      tokenEntity.auth = authEntity;
    });
    authEntity.refreshTokens = refreshTokenEntities;
    authEntity.createdAt = DateUtils.toUtcDate(auth.createdAt);
    authEntity.updatedAt = DateUtils.toUtcDate(auth.updatedAt);
    authEntity.deletedAt = auth.deletedAt ? DateUtils.toUtcDate(auth.deletedAt) : null;

    return authEntity;
  }

  static toEntities(auths: Auth[]): AuthEntity[] {
    if (auths.length === 0) return [];

    return auths.map((auth) => this.toEntity(auth));
  }
}

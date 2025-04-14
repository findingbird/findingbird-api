import { DateUtils } from '~/common/utils/Date.utils';
import { RefreshTokenProps, RefreshTokenVO } from '~/modules/auth/domain/models/refreshToken.vo';
import { RefreshTokenEntity } from '~/modules/auth/infrastructure/entities/refreshToken.entity';

export class RefreshTokenMapper {
  static toDomain(entity: RefreshTokenEntity): RefreshTokenVO {
    const tokenProps: RefreshTokenProps = {
      token: entity.token,
      expiredAt: DateUtils.toKst(entity.expiredAt),
    };

    return RefreshTokenVO.create(tokenProps);
  }

  static toDomains(entities: RefreshTokenEntity[]): RefreshTokenVO[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(token: RefreshTokenVO): RefreshTokenEntity {
    const tokenEntity = new RefreshTokenEntity();

    tokenEntity.token = token.token;
    tokenEntity.expiredAt = DateUtils.toUtcDate(token.expiredAt);

    return tokenEntity;
  }

  static toEntities(tokens: RefreshTokenVO[]): RefreshTokenEntity[] {
    if (tokens.length === 0) return [];

    return tokens.map((token) => this.toEntity(token));
  }
}

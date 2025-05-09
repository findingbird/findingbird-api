import { Dayjs } from 'dayjs';

import { UnauthorizedError } from '~/common/exceptions/UnauthorizedError';
import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';
import { RefreshTokenVO } from '~/modules/auth/domain/models/refreshToken.vo';

export interface AuthNewProps {
  userId: string;
  kakaoId: string;
}

export interface AuthProps extends AuthNewProps, DomainEntityProps {
  refreshTokens: RefreshTokenVO[];
  lastLoginAt: Dayjs;
}

export class Auth extends DomainEntity<AuthProps> {
  public static domainName = 'Auth';
  private constructor(id: string, props: AuthProps) {
    super(id, props);
  }

  public static create(id: string, props: AuthProps): Auth {
    const auth = new Auth(id, props);
    auth.validateDomain();
    return auth;
  }

  public static createNew(newProps: AuthNewProps): Auth {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      refreshTokens: [],
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private validateDomain(): void {
    if (!this.props.userId) {
      throw new ValidationError(Auth.domainName, 'UserId is required');
    }

    if (!this.props.kakaoId) {
      throw new ValidationError(Auth.domainName, 'KakaoId is required');
    }

    if (!this.props.createdAt) {
      throw new ValidationError(Auth.domainName, 'CreatedAt is required');
    }

    if (!this.props.updatedAt) {
      throw new ValidationError(Auth.domainName, 'UpdatedAt is required');
    }
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get kakaoId(): string {
    return this.props.kakaoId;
  }

  get refreshTokens(): RefreshTokenVO[] {
    return this.props.refreshTokens;
  }

  get lastLoginAt(): Dayjs {
    return this.props.lastLoginAt;
  }

  // Methods
  public saveRefreshToken(refreshToken: string, expiredAt: Dayjs): RefreshTokenVO {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => token.token !== refreshToken);
    const tokenVO = RefreshTokenVO.create({
      token: refreshToken,
      expiredAt,
    });
    this.props.refreshTokens.push(tokenVO);
    this.removeExpiredRefreshToken();
    const now = DateUtils.now();
    this.changeProps({ updatedAt: now, lastLoginAt: now });
    return tokenVO;
  }

  public verifyRefreshToken(refreshToken: string): void {
    const foundToken = this.props.refreshTokens.find((t) => t.token === refreshToken);
    if (!foundToken) {
      throw new UnauthorizedError(Auth.domainName, 'Refresh token not found');
    }
    if (foundToken.isExpired()) {
      throw new UnauthorizedError(Auth.domainName, 'Refresh token expired');
    }
    // 토큰은 일회용
    this.removeRefreshToken(refreshToken);
  }

  private removeRefreshToken(refreshToken: string): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((t) => t.token !== refreshToken);
  }

  private removeExpiredRefreshToken(): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => !token.isExpired());
  }
}

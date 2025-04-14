import { Dayjs } from 'dayjs';

import { ValueObject } from '~/common/models/ValueObject';
import { DateUtils } from '~/common/utils/Date.utils';

export interface RefreshTokenProps {
  token: string;
  expiredAt: Dayjs;
}

export class RefreshTokenVO extends ValueObject<RefreshTokenProps> {
  private constructor(props: RefreshTokenProps) {
    super(props);
  }

  public static create(props: RefreshTokenProps): RefreshTokenVO {
    return new RefreshTokenVO(props);
  }

  get token(): string {
    return this.props.token;
  }

  get expiredAt(): Dayjs {
    return this.props.expiredAt;
  }

  public isExpired(): boolean {
    return this.props.expiredAt.isBefore(DateUtils.now());
  }
}

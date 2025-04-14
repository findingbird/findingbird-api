import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface UserNewProps {}

export interface UserProps extends UserNewProps, DomainEntityProps {
  nickname: string;
}

export class User extends DomainEntity<UserProps> {
  public static domainName = 'User';
  private constructor(id: string, props: UserProps) {
    super(id, props);
  }

  public static create(id: string, props: UserProps): User {
    const user = new User(id, props);
    user.validateDomain();
    return user;
  }

  public static createNew(newProps: UserNewProps): User {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      nickname: this.generateRandomNickname(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private static generateRandomNickname(): string {
    const randomNumber = Math.floor(Math.random() * 10000);
    return `user${randomNumber}`;
  }

  private validateDomain(): void {
    if (!this.props.nickname) {
      throw new ValidationError(User.domainName, 'Nickname is required');
    }

    if (!this.props.createdAt) {
      throw new ValidationError(User.domainName, 'CreatedAt is required');
    }

    if (!this.props.updatedAt) {
      throw new ValidationError(User.domainName, 'UpdatedAt is required');
    }
  }

  // Getters
  get nickname(): string {
    return this.props.nickname;
  }

  // Methods
  public delete(): void {
    this.changeProps({
      deletedAt: DateUtils.now(),
    });
  }

  public restore(): void {
    this.changeProps({
      deletedAt: null,
    });
  }
}

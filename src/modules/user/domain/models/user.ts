import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface UserNewProps {}

export interface UserProps extends UserNewProps, DomainEntityProps {
  nickname: string;
}

export class User extends DomainEntity<UserProps> {
  public static domainName = 'User';
  private static readonly birdNames = [
    '참새',
    '비둘기',
    '까치',
    '직박구리',
    '청둥오리',
    '황조롱이',
    '제비',
    '딱따구리',
    '올빼미',
    '백로',
    '홍학',
    '펠리컨',
    '황새',
    '물떼새',
    '백조',
    '갈매기',
    '두루미',
    '오리',
    '타조',
    '앵무새',
    '카나리아',
  ];

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
    const randomBirdName = this.birdNames[Math.floor(Math.random() * this.birdNames.length)];
    return `${randomBirdName}${randomNumber}`;
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

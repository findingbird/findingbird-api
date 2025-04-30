import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface GoalNewProps {
  userId: string;
  birdId: string;
}

export interface GoalProps extends GoalNewProps, DomainEntityProps {
  isCompleted: boolean;
}

export class Goal extends DomainEntity<GoalProps> {
  public static domainName = 'Goal';
  private constructor(id: string, props: GoalProps) {
    super(id, props);
  }

  public static create(id: string, props: GoalProps): Goal {
    const goal = new Goal(id, props);
    goal.validateDomain();
    return goal;
  }

  public static createNew(newProps: GoalNewProps): Goal {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private validateDomain(): void {
    if (!this.props.userId) {
      throw new ValidationError(Goal.domainName, 'UserId is required');
    }

    if (!this.props.birdId) {
      throw new ValidationError(Goal.domainName, 'BirdId is required');
    }

    if (this.props.isCompleted === undefined) {
      throw new ValidationError(Goal.domainName, 'IsCompleted is required');
    }

    if (!this.props.createdAt) {
      throw new ValidationError(Goal.domainName, 'CreatedAt is required');
    }

    if (!this.props.updatedAt) {
      throw new ValidationError(Goal.domainName, 'UpdatedAt is required');
    }
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get birdId(): string {
    return this.props.birdId;
  }

  get isCompleted(): boolean {
    return this.props.isCompleted;
  }

  // Methods
  public complete(): void {
    this.changeProps({
      isCompleted: true,
      updatedAt: DateUtils.now(),
    });
  }

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

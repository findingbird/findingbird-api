import { Dayjs } from 'dayjs';

import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface RecordNewProps {
  userId: string;
  imageFileId: string;
  imageUrl: string;
  name: string | null;
  district: string;
  size: string;
  color: string;
  locationDescription: string;
  goalId: string | null;
}

export interface RecordNewPropsForOnboarding {
  userId: string;
  imageFileId: string;
  imageUrl: string;
  name: string | null;
  district: string;
  size: string;
  color: string;
  locationDescription: string;
  createdAt: Dayjs;
}

export interface RecordProps extends RecordNewProps, DomainEntityProps {}

export class Record extends DomainEntity<RecordProps> {
  public static domainName = 'Record';
  private constructor(id: string, props: RecordProps) {
    super(id, props);
  }

  public static create(id: string, props: RecordProps): Record {
    const record = new Record(id, props);
    record.validateDomain();
    return record;
  }

  public static createNew(newProps: RecordNewProps): Record {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  public static createNewForOnboarding(newProps: RecordNewPropsForOnboarding): Record {
    const id = crypto.randomUUID();
    const now = newProps.createdAt;
    return this.create(id, {
      ...newProps,
      goalId: null,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private validateDomain(): void {
    if (!this.props.userId) {
      throw new ValidationError(Record.domainName, 'UserId is required');
    }

    if (!this.props.imageFileId) {
      throw new ValidationError(Record.domainName, 'ImageFileId is required');
    }

    if (!this.props.imageUrl) {
      throw new ValidationError(Record.domainName, 'ImageUrl is required');
    }

    if (!this.props.district) {
      throw new ValidationError(Record.domainName, 'District is required');
    }

    if (!this.props.size) {
      throw new ValidationError(Record.domainName, 'Size is required');
    }

    if (!this.props.color) {
      throw new ValidationError(Record.domainName, 'Color is required');
    }

    if (!this.props.locationDescription) {
      throw new ValidationError(Record.domainName, 'LocationDescription is required');
    }
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get imageFileId(): string {
    return this.props.imageFileId;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get name(): string | null {
    return this.props.name;
  }

  get district(): string {
    return this.props.district;
  }

  get size(): string {
    return this.props.size;
  }

  get color(): string {
    return this.props.color;
  }

  get locationDescription(): string {
    return this.props.locationDescription;
  }
  get goalId(): string | null {
    return this.props.goalId;
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

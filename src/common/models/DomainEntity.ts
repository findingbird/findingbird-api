import { Dayjs } from 'dayjs';

export interface DomainEntityProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export abstract class DomainEntity<Props extends DomainEntityProps> {
  protected readonly _id: string;
  protected _props: Props;

  constructor(id: string, props: Props) {
    this._id = id;
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get props(): Props {
    return this._props;
  }

  get createdAt(): Dayjs {
    return this._props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this._props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this._props.deletedAt;
  }

  public equals(entity?: DomainEntity<Props>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    if (this.constructor !== entity.constructor) {
      return false;
    }
    return this._id === entity.id;
  }

  protected changeProps(newProps: Partial<Props>): void {
    this._props = { ...this._props, ...newProps };
  }
}

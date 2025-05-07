import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface BannerNewProps {
  title: string;
  imageUrl: string;
  link: string;
}

export interface BannerProps extends BannerNewProps, DomainEntityProps {}

export class Banner extends DomainEntity<BannerProps> {
  public static domainName = 'Banner';
  private constructor(id: string, props: BannerProps) {
    super(id, props);
  }

  public static create(id: string, props: BannerProps): Banner {
    const banner = new Banner(id, props);
    banner.validateDomain();
    return banner;
  }

  public static createNew(newProps: BannerNewProps): Banner {
    const id = crypto.randomUUID();
    const now = DateUtils.now();
    return this.create(id, {
      ...newProps,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  private validateDomain(): void {
    if (!this.props.title) {
      throw new ValidationError(Banner.domainName, 'Title is required');
    }

    if (!this.props.imageUrl) {
      throw new ValidationError(Banner.domainName, 'ImageUrl is required');
    }

    if (!this.props.link) {
      throw new ValidationError(Banner.domainName, 'Link is required');
    }
  }

  // Getters
  get title(): string {
    return this.props.title;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get link(): string {
    return this.props.link;
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

import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface ReportNewProps {
  userId: string;
  title: string;
  birdCount: number;
  collisionSiteType: string;
  mitigationApplied: boolean;
  speciesInfo: string;
  observationLocation: string;
  description: string;
  imageFileId: string;
  imageUrl: string;
}

export interface ReportProps extends ReportNewProps, DomainEntityProps {}

export class Report extends DomainEntity<ReportProps> {
  public static domainName = 'Report';
  private constructor(id: string, props: ReportProps) {
    super(id, props);
  }

  public static create(id: string, props: ReportProps): Report {
    const report = new Report(id, props);
    report.validateDomain();
    return report;
  }

  public static createNew(newProps: ReportNewProps): Report {
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
    if (!this.props.userId) {
      throw new ValidationError(Report.domainName, 'UserId is required');
    }

    if (!this.props.title) {
      throw new ValidationError(Report.domainName, 'Title is required');
    }

    if (!this.props.birdCount) {
      throw new ValidationError(Report.domainName, 'BirdCount is required');
    }
    if (this.props.birdCount < 0) {
      throw new ValidationError(Report.domainName, 'BirdCount must be greater than or equal to 0');
    }
    if (!Number.isInteger(this.props.birdCount)) {
      throw new ValidationError(Report.domainName, 'BirdCount must be an integer');
    }

    if (!this.props.collisionSiteType) {
      throw new ValidationError(Report.domainName, 'CollisionSiteType is required');
    }

    if (this.props.mitigationApplied === undefined) {
      throw new ValidationError(Report.domainName, 'MitigationApplied is required');
    }

    if (!this.props.speciesInfo) {
      throw new ValidationError(Report.domainName, 'SpeciesInfo is required');
    }

    if (!this.props.observationLocation) {
      throw new ValidationError(Report.domainName, 'ObservationLocation is required');
    }

    if (!this.props.description) {
      throw new ValidationError(Report.domainName, 'Description is required');
    }

    if (!this.props.imageFileId) {
      throw new ValidationError(Report.domainName, 'ImageFileId is required');
    }

    if (!this.props.imageUrl) {
      throw new ValidationError(Report.domainName, 'ImageUrl is required');
    }
  }

  // Getters
  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get birdCount(): number {
    return this.props.birdCount;
  }

  get collisionSiteType(): string {
    return this.props.collisionSiteType;
  }

  get mitigationApplied(): boolean {
    return this.props.mitigationApplied;
  }

  get speciesInfo(): string {
    return this.props.speciesInfo;
  }

  get observationLocation(): string {
    return this.props.observationLocation;
  }

  get description(): string {
    return this.props.description;
  }

  get imageFileId(): string {
    return this.props.imageFileId;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
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

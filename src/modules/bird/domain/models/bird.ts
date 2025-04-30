import { ValidationError } from '~/common/exceptions/ValidatioinError';
import { DomainEntity, DomainEntityProps } from '~/common/models/DomainEntity';
import { DateUtils } from '~/common/utils/Date.utils';

export interface BirdNewProps {
  speciesName: string;
  scientificName: string | null;
  habitatType: string;
  appearanceCount: number;
  morphoTrait: string | null;
  ecoTrait: string | null;
  districts: string[];
  imageUrl: string;
}

export interface BirdProps extends BirdNewProps, DomainEntityProps {}

export class Bird extends DomainEntity<BirdProps> {
  public static domainName = 'Bird';

  private constructor(id: string, props: BirdProps) {
    super(id, props);
  }

  public static create(id: string, props: BirdProps): Bird {
    const bird = new Bird(id, props);
    bird.validateDomain();
    return bird;
  }

  public static createNew(newProps: BirdNewProps): Bird {
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
    if (!this.props.speciesName) {
      throw new ValidationError(Bird.domainName, 'SpeciesName is required');
    }

    if (!this.props.habitatType) {
      throw new ValidationError(Bird.domainName, 'HabitatType is required');
    }

    if (!this.props.districts || this.props.districts.length === 0) {
      throw new ValidationError(Bird.domainName, 'Districts are required');
    }

    if (this.props.appearanceCount < 0) {
      throw new ValidationError(Bird.domainName, 'AppearanceCount cannot be negative');
    }

    if (!this.props.imageUrl) {
      throw new ValidationError(Bird.domainName, 'ImageUrl is required');
    }
  }

  // Getters
  get speciesName(): string {
    return this.props.speciesName;
  }

  get scientificName(): string | null {
    return this.props.scientificName;
  }

  get habitatType(): string {
    return this.props.habitatType;
  }

  get morphoTrait(): string | null {
    return this.props.morphoTrait;
  }

  get ecoTrait(): string | null {
    return this.props.ecoTrait;
  }

  get districts(): string[] {
    return this.props.districts;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }

  get appearanceCount(): number {
    return this.props.appearanceCount;
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

import { Bird } from '~/modules/bird/domain/models/bird';

export const BIRD_REPOSITORY = Symbol('IBirdRepository');

export interface IBirdRepository {
  findById(id: string): Promise<Bird | null>;
  findByIds(ids: string[]): Promise<Bird[]>;
  findMany(filter: BirdFilter): Promise<Bird[]>;
  save(record: Bird): Promise<void>;
  save(records: Bird[]): Promise<void>;
}

export interface BirdFilter {
  easyToFind?: boolean;
}

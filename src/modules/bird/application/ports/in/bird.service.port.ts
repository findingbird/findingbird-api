import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { GetBirdByScientificNameDto } from '~/modules/bird/application/dtos/get-bird-by-scientific-name.dto';
import { GetBirdsByIdsDto } from '~/modules/bird/application/dtos/get-birds-by-ids.dto';

export const BIRD_SERVICE = Symbol('IBirdService');

export interface IBirdService {
  getBirdById(dto: GetBirdByIdDto): Promise<BirdResultDto>;
  getBirdByScientificName(dto: GetBirdByScientificNameDto): Promise<BirdResultDto>;
  getBirdsByIds(dto: GetBirdsByIdsDto): Promise<BirdResultDto[]>;
  getAllBirds(): Promise<BirdResultDto[]>;
  getFrequentlySeenBirds(): Promise<BirdResultDto[]>;
  getEasyToFindBirds(): Promise<BirdResultDto[]>;
}

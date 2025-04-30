import { BirdResponseDto } from '~/modules/bird/application/dtos/bird.response';
import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { getBirdsByIdsDto } from '~/modules/bird/application/dtos/get-bird-by-ids.dto';

export const BIRD_SERVICE = Symbol('IBirdService');

export interface IBirdService {
  getBirdById(dto: GetBirdByIdDto): Promise<BirdResponseDto>;
  getBirdsByIds(dto: getBirdsByIdsDto): Promise<BirdResponseDto[]>;
  getAllBirds(): Promise<BirdResponseDto[]>;
}

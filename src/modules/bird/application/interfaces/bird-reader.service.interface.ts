import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { GetBirdsByIdsDto } from '~/modules/bird/application/dtos/get-bird-by-ids.dto';

export const BIRD_READER = Symbol('IBirdReader');

export interface IBirdReader {
  getBirdById(dto: GetBirdByIdDto): Promise<IBirdResponseDto>;
  getBirdsByIds(dto: GetBirdsByIdsDto): Promise<IBirdResponseDto[]>;
  getAllBirds(): Promise<IBirdResponseDto[]>;
}

export interface IBirdResponseDto {
  id: string;
  speciesName: string;
  scientificName: string | null;
  habitatType: string;
  appearanceCount: number;
  morphoTrait: string | null;
  ecoTrait: string | null;
  districts: string[];
  imageUrl: string;
}

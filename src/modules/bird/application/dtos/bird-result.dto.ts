import { Bird } from '~/modules/bird/domain/models/bird';

export class BirdResultDto {
  readonly id: string;
  readonly speciesName: string;
  readonly scientificName: string | null;
  readonly habitatType: string;
  readonly appearanceCount: number;
  readonly morphoTrait: string | null;
  readonly ecoTrait: string | null;
  readonly districts: string[];
  readonly imageUrl: string;

  static fromDomain(bird: Bird): BirdResultDto {
    return {
      id: bird.id,
      speciesName: bird.speciesName,
      scientificName: bird.scientificName,
      habitatType: bird.habitatType,
      appearanceCount: bird.appearanceCount,
      morphoTrait: bird.morphoTrait,
      ecoTrait: bird.ecoTrait,
      districts: bird.districts,
      imageUrl: bird.imageUrl,
    };
  }
}

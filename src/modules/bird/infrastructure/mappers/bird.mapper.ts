import { DateUtils } from '~/common/utils/Date.utils';
import { Bird, BirdProps } from '~/modules/bird/domain/models/bird';
import { BirdEntity } from '~/modules/bird/infrastructure/entities/bird.entity';

export class BirdMapper {
  static toDomain(entity: BirdEntity): Bird {
    const birdProps: BirdProps = {
      speciesName: entity.speciesName,
      scientificName: entity.scientificName,
      habitatType: entity.habitatType,
      appearanceCount: entity.appearanceCount,
      morphoTrait: entity.morphoTrait,
      ecoTrait: entity.ecoTrait,
      districts: entity.districts,
      imageUrl: entity.imageUrl,
      createdAt: DateUtils.toKst(entity.createdAt),
      updatedAt: DateUtils.toKst(entity.updatedAt),
      deletedAt: entity.deletedAt ? DateUtils.toKst(entity.deletedAt) : null,
    };

    return Bird.create(entity.id, birdProps);
  }

  static toDomains(entities: BirdEntity[]): Bird[] {
    if (entities.length === 0) return [];

    return entities.map((entity) => this.toDomain(entity));
  }

  static toEntity(bird: Bird): BirdEntity {
    const birdEntity = new BirdEntity();

    birdEntity.id = bird.id;
    birdEntity.speciesName = bird.speciesName;
    birdEntity.scientificName = bird.scientificName;
    birdEntity.habitatType = bird.habitatType;
    birdEntity.appearanceCount = bird.appearanceCount;
    birdEntity.morphoTrait = bird.morphoTrait;
    birdEntity.ecoTrait = bird.ecoTrait;
    birdEntity.districts = bird.districts;
    birdEntity.imageUrl = bird.imageUrl;
    birdEntity.createdAt = DateUtils.toUtcDate(bird.createdAt);
    birdEntity.updatedAt = DateUtils.toUtcDate(bird.updatedAt);
    birdEntity.deletedAt = bird.deletedAt ? DateUtils.toUtcDate(bird.deletedAt) : null;

    return birdEntity;
  }

  static toEntities(birds: Bird[]): BirdEntity[] {
    if (birds.length === 0) return [];

    return birds.map((bird) => this.toEntity(bird));
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { BirdResultDto } from '~/modules/bird/application/dtos/bird-result.dto';
import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { GetBirdByScientificNameDto } from '~/modules/bird/application/dtos/get-bird-by-scientific-name.dto';
import { GetBirdsByIdsDto } from '~/modules/bird/application/dtos/get-birds-by-ids.dto';
import { IBirdService } from '~/modules/bird/application/ports/in/bird.service.port';
import { BIRD_REPOSITORY, IBirdRepository } from '~/modules/bird/application/ports/out/bird.repository.port';
import { Bird } from '~/modules/bird/domain/models/bird';

@Injectable()
export class BirdService implements IBirdService {
  constructor(
    @Inject(BIRD_REPOSITORY)
    private readonly birdRepository: IBirdRepository
  ) {}

  async getBirdById(dto: GetBirdByIdDto): Promise<BirdResultDto> {
    const { birdId } = dto;
    const bird = await this.birdRepository.findById(birdId);
    if (!bird) {
      throw new NotFoundError(Bird.domainName, birdId);
    }
    return BirdResultDto.fromDomain(bird);
  }

  async getBirdByScientificName(dto: GetBirdByScientificNameDto): Promise<BirdResultDto> {
    const { scientificName } = dto;
    const bird = await this.birdRepository.findByScientificName(scientificName);
    if (!bird) {
      throw new NotFoundError(Bird.domainName, scientificName);
    }
    return BirdResultDto.fromDomain(bird);
  }

  async getBirdsByIds(dto: GetBirdsByIdsDto): Promise<BirdResultDto[]> {
    const { birdIds } = dto;
    const uniqueBirdIds = [...new Set(birdIds)];
    const birds = await this.birdRepository.findByIds(uniqueBirdIds);
    if (birds.length !== uniqueBirdIds.length) {
      const notFoundBirdIds = uniqueBirdIds.filter((birdId) => !birds.some((bird) => bird.id === birdId));
      throw new NotFoundError(Bird.domainName, notFoundBirdIds.join(', '));
    }
    return birds.map((bird) => BirdResultDto.fromDomain(bird));
  }

  async getFrequentlySeenBirds(): Promise<BirdResultDto[]> {
    const birds = await this.birdRepository.findMany({ minAppearanceCount: 20 });
    return birds.map((bird) => BirdResultDto.fromDomain(bird));
  }

  async getAllBirds(): Promise<BirdResultDto[]> {
    const birds = await this.birdRepository.findMany({});
    return birds.map((bird) => BirdResultDto.fromDomain(bird));
  }

  async getEasyToFindBirds(): Promise<BirdResultDto[]> {
    const birds = await this.birdRepository.findMany({ easyToFind: true });
    return birds.map((bird) => BirdResultDto.fromDomain(bird));
  }
}

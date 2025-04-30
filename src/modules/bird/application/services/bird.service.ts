import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { BirdResponseDto } from '~/modules/bird/application/dtos/bird.response';
import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { getBirdsByIdsDto } from '~/modules/bird/application/dtos/get-bird-by-ids.dto';
import { IBirdService } from '~/modules/bird/application/interfaces/bird.service.interface';
import { Bird } from '~/modules/bird/domain/models/bird';
import { BIRD_REPOSITORY, IBirdRepository } from '~/modules/bird/domain/repositories/bird.repository.interface';

@Injectable()
export class BirdService implements IBirdService {
  constructor(
    @Inject(BIRD_REPOSITORY)
    private readonly birdRepository: IBirdRepository
  ) {}

  async getAllBirds(): Promise<BirdResponseDto[]> {
    const birds = await this.birdRepository.findAll();
    return birds.map((bird) => BirdResponseDto.fromDomain(bird));
  }

  async getBirdById(dto: GetBirdByIdDto): Promise<BirdResponseDto> {
    const { birdId } = dto;
    const bird = await this.birdRepository.findById(birdId);
    if (!bird) {
      throw new NotFoundError(Bird.domainName, birdId);
    }
    return BirdResponseDto.fromDomain(bird);
  }

  async getBirdsByIds(dto: getBirdsByIdsDto): Promise<BirdResponseDto[]> {
    const { birdIds } = dto;
    const birds = await this.birdRepository.findByIds(birdIds);
    if (birds.length !== birdIds.length) {
      const notFoundBirdIds = birdIds.filter((birdId) => !birds.some((bird) => bird.id === birdId));
      throw new NotFoundError(Bird.domainName, notFoundBirdIds.join(', '));
    }
    return birds.map((bird) => BirdResponseDto.fromDomain(bird));
  }
}

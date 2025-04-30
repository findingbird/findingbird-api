import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from '~/common/exceptions/NotFoundError';
import { GetBirdByIdDto } from '~/modules/bird/application/dtos/get-bird-by-id.dto';
import { Bird } from '~/modules/bird/domain/models/bird';
import { BIRD_REPOSITORY, IBirdRepository } from '~/modules/bird/domain/repositories/bird.repository.interface';

@Injectable()
export class BirdService {
  constructor(
    @Inject(BIRD_REPOSITORY)
    private readonly birdRepository: IBirdRepository
  ) {}

  async getBirds(): Promise<Bird[]> {
    const birds = await this.birdRepository.findAll();
    return birds;
  }

  async getBirdById(dto: GetBirdByIdDto): Promise<Bird> {
    const { birdId } = dto;
    const bird = await this.birdRepository.findById(birdId);
    if (!bird) {
      throw new NotFoundError(Bird.domainName, birdId);
    }
    return bird;
  }
}

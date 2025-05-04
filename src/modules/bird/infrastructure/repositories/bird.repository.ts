import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { IBirdRepository } from '~/modules/bird/application/ports/out/bird.repository.port';
import { Bird } from '~/modules/bird/domain/models/bird';
import { BirdEntity } from '~/modules/bird/infrastructure/entities/bird.entity';
import { BirdMapper } from '~/modules/bird/infrastructure/mappers/bird.mapper';

@Injectable()
export class BirdRepository implements IBirdRepository {
  constructor(
    @InjectRepository(BirdEntity)
    private readonly birdRepository: Repository<BirdEntity>
  ) {}

  async findById(id: string): Promise<Bird | null> {
    const birdEntity = await this.birdRepository.findOne({ where: { id } });
    return birdEntity ? BirdMapper.toDomain(birdEntity) : null;
  }

  async findByIds(ids: string[]): Promise<Bird[]> {
    const birdEntities = await this.birdRepository.find({
      where: { id: In(ids) },
    });
    return BirdMapper.toDomains(birdEntities);
  }

  async findAll(): Promise<Bird[]> {
    const birdEntities = await this.birdRepository.find();
    return BirdMapper.toDomains(birdEntities);
  }

  async save(record: Bird): Promise<void>;
  async save(records: Bird[]): Promise<void>;
  async save(records: Bird | Bird[]): Promise<void> {
    if (Array.isArray(records)) {
      const birdEntities = BirdMapper.toEntities(records);
      await this.birdRepository.save(birdEntities);
    } else {
      const birdEntity = BirdMapper.toEntity(records);
      await this.birdRepository.save(birdEntity);
    }
  }
}

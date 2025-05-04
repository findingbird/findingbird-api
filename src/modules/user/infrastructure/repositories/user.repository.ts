import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository } from '~/modules/user/application/ports/out/user.repository.port';
import { User } from '~/modules/user/domain/models/user';
import { UserEntity } from '~/modules/user/infrastructure/entities/user.entity';
import { UserMapper } from '~/modules/user/infrastructure/mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ where: { id } });
    return userEntity ? UserMapper.toDomain(userEntity) : null;
  }

  async save(user: User): Promise<void>;
  async save(users: User[]): Promise<void>;
  async save(user: User | User[]): Promise<void> {
    if (Array.isArray(user)) {
      const userEntities = UserMapper.toEntities(user);
      await this.userRepository.save(userEntities);
    } else {
      const userEntity = UserMapper.toEntity(user);
      await this.userRepository.save(userEntity);
    }
  }
}

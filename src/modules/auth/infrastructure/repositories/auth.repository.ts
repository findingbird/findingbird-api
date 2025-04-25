import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';

import { Auth } from '~/modules/auth/domain/models/auth';
import { IAuthRepository } from '~/modules/auth/domain/repositories/auth.repository.interface';
import { AuthEntity } from '~/modules/auth/infrastructure/entities/auth.entity';
import { AuthMapper } from '~/modules/auth/infrastructure/mappers/auth.mapper';

@Injectable()
export class AuthRepository implements IAuthRepository {
  private authFindOptionsRelation: FindOptionsRelations<AuthEntity> = {
    refreshTokens: true,
  };

  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>
  ) {}

  async findByKakaoId(kakaoId: string): Promise<Auth | null> {
    const authEntity = await this.authRepository.findOne({
      where: { kakaoId },
      relations: { ...this.authFindOptionsRelation },
    });
    return authEntity ? AuthMapper.toDomain(authEntity) : null;
  }

  async findByUserId(userId: string): Promise<Auth | null> {
    const authEntity = await this.authRepository.findOne({
      where: { userId },
      relations: { ...this.authFindOptionsRelation },
    });
    return authEntity ? AuthMapper.toDomain(authEntity) : null;
  }

  async save(auth: Auth): Promise<void>;
  async save(auths: Auth[]): Promise<void>;
  async save(auth: Auth | Auth[]): Promise<void> {
    if (Array.isArray(auth)) {
      const authEntities = AuthMapper.toEntities(auth);
      await this.authRepository.save(authEntities);
    } else {
      const authEntity = AuthMapper.toEntity(auth);
      await this.authRepository.save(authEntity);
    }
  }
}

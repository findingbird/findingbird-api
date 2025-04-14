import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '~/modules/auth/application/services/auth.service';
import { AUTH_REPOSITORY } from '~/modules/auth/domain/repositories/auth.repository.interface';
import { AuthEntity } from '~/modules/auth/infrastructure/entities/auth.entity';
import { RefreshTokenEntity } from '~/modules/auth/infrastructure/entities/refreshToken.entity';
import { AuthRepository } from '~/modules/auth/infrastructure/repositories/auth.repository';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { KakaoStrategy } from '~/modules/auth/presentation/strategies/kakao.strategy';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity, RefreshTokenEntity]), JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    KakaoStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

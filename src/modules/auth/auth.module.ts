import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AUTH_SERVICE } from '~/modules/auth/application/ports/in/auth.service.port';
import { AUTH_REPOSITORY } from '~/modules/auth/application/ports/out/auth.repository.port';
import { AuthService } from '~/modules/auth/application/services/auth.service';
import { JwtStrategy } from '~/modules/auth/application/strategies/jwt.strategy';
import { JwtRefreshStrategy } from '~/modules/auth/application/strategies/jwt-refresh.strategy';
import { KakaoStrategy } from '~/modules/auth/application/strategies/kakao.strategy';
import { AuthEntity } from '~/modules/auth/infrastructure/entities/auth.entity';
import { RefreshTokenEntity } from '~/modules/auth/infrastructure/entities/refreshToken.entity';
import { AuthRepository } from '~/modules/auth/infrastructure/repositories/auth.repository';
import { AuthController } from '~/modules/auth/presentation/http/auth.controller';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AuthEntity, RefreshTokenEntity]), JwtModule.register({}), UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
    KakaoStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AUTH_SERVICE],
})
export class AuthModule {}

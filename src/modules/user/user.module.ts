import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OnboardingModule } from '~/modules/onboarding/onboarding.module';
import { USER_SERVICE } from '~/modules/user/application/ports/in/user.service.port';
import { USER_REPOSITORY } from '~/modules/user/application/ports/out/user.repository.port';
import { UserService } from '~/modules/user/application/services/user.service';
import { UserEntity } from '~/modules/user/infrastructure/entities/user.entity';
import { UserRepository } from '~/modules/user/infrastructure/repositories/user.repository';
import { UserController } from '~/modules/user/presentation/http/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), OnboardingModule],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE,
      useClass: UserService,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [USER_SERVICE],
})
export class UserModule {}

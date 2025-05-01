import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { USER_PERSISTER } from '~/modules/user/application/interfaces/user-persister.interface';
import { UserService } from '~/modules/user/application/services/user.service';
import { USER_REPOSITORY } from '~/modules/user/domain/repositories/user.repository.interface';
import { UserEntity } from '~/modules/user/infrastructure/entities/user.entity';
import { UserRepository } from '~/modules/user/infrastructure/repositories/user.repository';
import { UserController } from '~/modules/user/presentation/http/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: USER_PERSISTER,
      useExisting: UserService,
    },
  ],
  exports: [USER_PERSISTER],
})
export class UserModule {}

import '~/config/dayjs.config';

import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieParser from 'cookie-parser';

import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { GlobalExceptionFilter } from '~/common/filters/Global-exception.filter';
import { LoggingInterceptor } from '~/common/interceptors/Logging.interceptor';
import { TypeOrmConfig } from '~/config/typeorm.config';
import { AuthModule } from '~/modules/auth/auth.module';
import { BirdModule } from '~/modules/bird/bird.module';
import { FileModule } from '~/modules/file/file.module';
import { GoalModule } from '~/modules/goal/goal.module';
import { RecordModule } from '~/modules/record/record.module';
import { UserModule } from '~/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfig,
    }),
    UserModule,
    AuthModule,
    FileModule,
    RecordModule,
    BirdModule,
    GoalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        stopAtFirstError: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(cookieParser()).forRoutes('*');
  }
}

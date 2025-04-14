import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '~/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT') ?? '3000');
  app.enableCors({
    origin: config.get<string>('CLIENT_URL') || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();

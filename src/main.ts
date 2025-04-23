import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '~/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Finding Bird API Documentation')
    .setDescription('API documentation for the Finding-Bird application')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'JWT access token',
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>('PORT') ?? '3000');
  const clientUrl = config.get<string>('CLIENT_URL') || 'http://localhost:3000';
  config.set('CLIENT_URL', clientUrl);
  app.enableCors({
    origin: config.get<string>('CLIENT_URL'),
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();

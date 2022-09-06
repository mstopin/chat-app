import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './AppModule';

(async function boostrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: true,
    })
  );

  const configService = app.get<ConfigService>(ConfigService);
  const APP_PORT = configService.getOrThrow<number>('APP_PORT');
  await app.listen(APP_PORT);
})().catch(console.error);

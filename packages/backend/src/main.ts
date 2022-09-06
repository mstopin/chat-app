import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app';

(async function boostrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  const APP_PORT = configService.getOrThrow<number>('APP_PORT');
  await app.listen(APP_PORT);
})().catch(console.error);

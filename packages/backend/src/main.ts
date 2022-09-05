import { NestFactory } from '@nestjs/core';

import { AppModule } from './app';

(async function boostrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
})().catch(console.error);

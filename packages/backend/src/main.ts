import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import session from 'express-session';
import sessionConnectRedis from 'connect-redis';

import { AppModule } from './AppModule';

(async function boostrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const REDIS_HOST = configService.getOrThrow<string>('REDIS_HOST');
  const REDIS_PORT = configService.getOrThrow<number>('REDIS_PORT');
  const redis = new Redis(REDIS_PORT, REDIS_HOST);

  const SESSION_SECRET = configService.getOrThrow<string>('SESSION_SECRET');
  const RedisSessionStore = sessionConnectRedis(session);
  app.use(
    session({
      cookie: {
        maxAge: 3 * 24 * 3600,
        sameSite: 'strict',
      },
      secret: SESSION_SECRET,
      name: 'chat-app.sid',
      resave: false,
      saveUninitialized: false,
      store: new RedisSessionStore({ client: redis }),
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      disableErrorMessages: true,
    })
  );

  if ((configService.get('NODE_ENV') || 'development') !== 'production') {
    app.enableCors({
      origin: '*',
    });
  }

  const APP_PORT = configService.getOrThrow<number>('APP_PORT');
  await app.listen(APP_PORT);
})().catch(console.error);

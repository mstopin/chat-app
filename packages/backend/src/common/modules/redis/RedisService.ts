import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
  private client: RedisClient;

  constructor(configService: ConfigService) {
    const REDIS_HOST = configService.getOrThrow<string>('REDIS_HOST');
    const REDIS_PORT = configService.getOrThrow<number>('REDIS_PORT');
    this.client = new Redis(REDIS_PORT, REDIS_HOST);
  }

  getClient() {
    return this.client;
  }
}

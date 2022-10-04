import RedisClient from 'ioredis';

export class Redis {
  private client: RedisClient;

  constructor() {
    const REDIS_HOST = process.env['REDIS_HOST'];
    const REDIS_PORT = process.env['REDIS_PORT'];

    if (!REDIS_HOST || !REDIS_PORT) {
      throw new Error('Invalid Redis config');
    }

    this.client = new RedisClient(Number(REDIS_PORT), REDIS_HOST);
  }

  getClient() {
    return this.client;
  }
}

import { Module, Global } from '@nestjs/common';

import { RedisService } from './RedisService';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}

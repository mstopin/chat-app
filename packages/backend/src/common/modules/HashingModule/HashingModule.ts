import { Module, Global } from '@nestjs/common';

import { HashingService } from './services/HashingService';
import { BcryptHashingService } from './services/BcryptHashingService';
import { PassthroughHashingService } from './services/PassthroughHashingService';

@Global()
@Module({
  providers: [
    BcryptHashingService,
    PassthroughHashingService,
    { provide: HashingService, useClass: BcryptHashingService },
  ],
  exports: [HashingService, BcryptHashingService, PassthroughHashingService],
})
export class HashingModule {}

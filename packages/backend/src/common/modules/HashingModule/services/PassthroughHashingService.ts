import { Injectable } from '@nestjs/common';

import { HashingService } from './HashingService';

@Injectable()
export class PassthroughHashingService extends HashingService {
  hash(password: string): Promise<string> {
    return Promise.resolve(password);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return Promise.resolve(password === hash);
  }
}

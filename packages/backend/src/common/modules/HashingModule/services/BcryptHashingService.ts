import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { HashingService } from './HashingService';

@Injectable()
export class BcryptHashingService extends HashingService {
  async hash(password: string, saltLength: number): Promise<string> {
    return await bcrypt.hash(password, saltLength);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

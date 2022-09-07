import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingService {
  abstract hash(password: string, saltLength: number): Promise<string>;
  abstract compare(password: string, hash: string): Promise<boolean>;
}

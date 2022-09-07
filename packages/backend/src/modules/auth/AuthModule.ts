import { Module } from '@nestjs/common';

import { UserModule } from '../user';

import { AuthService } from './services/AuthService';
import { AuthController } from './controllers/AuthController';

@Module({
  imports: [UserModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

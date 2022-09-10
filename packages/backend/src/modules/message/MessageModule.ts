import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/Message';
import { MessageService } from './services/MessageService';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}

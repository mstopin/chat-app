import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user';
import { MessageModule } from '../message';
import { Message } from '../message/entities/Message';

import { Channel } from './entities/Channel';
import { ChannelController } from './controllers/ChannelController';
import { ChannelMessageController } from './controllers/ChannelMessageController';
import { ChannelService } from './services/ChannelService';
import { ChannelMessageService } from './services/ChannelMessageService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Message]),
    UserModule,
    MessageModule,
  ],
  controllers: [ChannelController, ChannelMessageController],
  providers: [ChannelService, ChannelMessageService],
})
export class ChannelModule {}

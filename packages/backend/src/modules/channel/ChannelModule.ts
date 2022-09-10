import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user';
import { Message } from '../message/entities/Message';

import { Channel } from './entities/Channel';
import { ChannelController } from './controllers/ChannelController';
import { ChannelService } from './services/ChannelService';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, Message]), UserModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}

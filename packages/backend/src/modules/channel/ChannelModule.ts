import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user';

import { Channel } from './entities/Channel';
import { ChannelController } from './controllers/ChannelController';
import { ChannelService } from './services/ChannelService';

@Module({
  imports: [TypeOrmModule.forFeature([Channel]), UserModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}

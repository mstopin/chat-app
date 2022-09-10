import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/User';
import { UserService } from '../../user/services/UserService';
import { MessageService } from '../../message/services/MessageService';

import { Channel } from '../entities/Channel';

import { BaseChannelService } from './BaseChannelService';
import { GetAllMessagesDTO } from './dtos/GetAllMessagesDTO';
import { SendMessageDTO } from './dtos/SendMessageDTO';

// TODO: prevent data overfetching
@Injectable()
export class ChannelMessageService extends BaseChannelService {
  constructor(
    @InjectRepository(Channel) channelRepository: Repository<Channel>,
    userService: UserService,
    private messageService: MessageService
  ) {
    super(channelRepository, userService);
  }

  private isMemberOrOwner(user: User, channel: Channel) {
    return (
      channel.owner.id === user.id ||
      !!channel.members.find((u) => u.id === user.id)
    );
  }

  async getAll(getAllMessagesDTO: GetAllMessagesDTO) {
    const { userId, channelId } = getAllMessagesDTO;
    const [user, channel] = await this.findUserAndChannelById(
      userId,
      channelId,
      true,
      true,
      true
    );
    if (!this.isMemberOrOwner(user, channel)) {
      throw new BadRequestException('You are not a member of this channel');
    }
    return channel.messages;
  }

  async send(sendMessageDTO: SendMessageDTO) {
    const { userId, channelId, content } = sendMessageDTO;
    const [user, channel] = await this.findUserAndChannelById(
      userId,
      channelId,
      true,
      true
    );
    if (!this.isMemberOrOwner(user, channel)) {
      throw new BadRequestException('You are not a member of this channel');
    }
    const message = await this.messageService.createMessage({
      user,
      channel,
      content,
    });
    return message;
  }
}

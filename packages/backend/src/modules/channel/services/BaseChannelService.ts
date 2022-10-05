import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from '../../user/services/UserService';

import { Channel } from '../entities/Channel';

export abstract class BaseChannelService {
  constructor(
    protected channelRepository: Repository<Channel>,
    protected userService: UserService
  ) {}

  protected async findUserById(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  protected async findChannelById(
    channelId: string,
    withDeleted = false,
    loadOwner = false,
    loadMembers = false,
    loadMessages = false
  ) {
    const channel = await this.channelRepository.findOne({
      relations: {
        owner: loadOwner,
        members: loadMembers,
        messages: loadMessages,
      },
      where: {
        id: channelId,
      },
      withDeleted,
    });
    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }
    return channel;
  }
}

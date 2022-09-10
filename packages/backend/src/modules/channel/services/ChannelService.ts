import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashingService } from '../../../common/modules/HashingModule';

import { UserService } from '../../user/services/UserService';

import { Channel } from '../entities/Channel';

import { BaseChannelService } from './BaseChannelService';
import { CreateChannelDTO } from './dtos/CreateChannelDTO';
import { DeleteChannelDTO } from './dtos/DeleteChannelDTO';
import { JoinChannelDTO } from './dtos/JoinChannelDTO';
import { LeaveChannelDTO } from './dtos/LeaveChannelDTO';

interface FindAllParams {
  withOwner?: boolean;
  withMembers?: boolean;
}

@Injectable()
export class ChannelService extends BaseChannelService {
  constructor(
    @InjectRepository(Channel) channelRepository: Repository<Channel>,
    userService: UserService,
    private hashingService: HashingService
  ) {
    super(channelRepository, userService);
  }

  async findAll(params: FindAllParams = {}) {
    return await this.channelRepository.find({
      relations: {
        owner: !!params.withOwner,
        members: !!params.withMembers,
      },
    });
  }

  async create(createChannelDTO: CreateChannelDTO) {
    const { ownerId, name, password } = createChannelDTO;
    const owner = await this.findUserById(ownerId);
    const hashedPassword = password
      ? await this.hashingService.hash(password, 10)
      : null;
    const channel = await this.channelRepository.save({
      name,
      password: hashedPassword,
      owner,
      members: [],
    });
    return channel;
  }

  async delete(deleteChannelDTO: DeleteChannelDTO) {
    const { ownerId, channelId } = deleteChannelDTO;
    const [owner, channel] = await this.findUserAndChannelById(
      ownerId,
      channelId,
      true,
      false
    );
    if (owner.id !== channel.owner.id) {
      throw new ForbiddenException('You do not own this channel');
    }
    await this.channelRepository.softDelete({ id: channelId });
  }

  async join(joinChannelDTO: JoinChannelDTO) {
    const { userId, channelId } = joinChannelDTO;
    const [user, channel] = await this.findUserAndChannelById(
      userId,
      channelId,
      true,
      true
    );
    if (user.id === channel.owner.id) {
      throw new BadRequestException('You cannot join your own channel');
    }
    if (channel.members.find((u) => u.id === user.id)) {
      throw new BadRequestException('You have already joined this channel');
    }
    channel.members.push(user);
    await this.channelRepository.save(channel);
  }

  async leave(leaveChannelDTO: LeaveChannelDTO) {
    const { userId, channelId } = leaveChannelDTO;
    const [user, channel] = await this.findUserAndChannelById(
      userId,
      channelId,
      true,
      true
    );
    if (user.id === channel.owner.id) {
      throw new BadRequestException(
        'You cannot leave your own channel. Delete it instead.'
      );
    }
    if (!channel.members.find((u) => u.id === user.id)) {
      throw new BadRequestException('You are not a member of this channel');
    }
    channel.members = channel.members.filter((u) => u.id !== user.id);
    await this.channelRepository.save(channel);
  }
}

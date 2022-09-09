import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashingService } from '../../../common/modules/HashingModule';

import { UserService } from '../../user/services/UserService';

import { Channel } from '../entities/Channel';

import { CreateChannelDTO } from './dtos/CreateChannelDTO';
import { DeleteChannelDTO } from './dtos/DeleteChannelDTO';

interface FindAllParams {
  withOwner?: boolean;
  withMembers?: boolean;
}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepository: Repository<Channel>,
    private userService: UserService,
    private hashingService: HashingService
  ) {}

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
    const owner = await this.userService.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('User does not exist');
    }
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
    const owner = await this.userService.findById(ownerId);
    if (!owner) {
      throw new NotFoundException('User does not exist');
    }
    const channel = await this.channelRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id: channelId,
      },
    });
    if (!channel) {
      throw new NotFoundException('Channel does not exist');
    }
    if (owner.id !== channel.owner.id) {
      throw new ForbiddenException('You do not own this channel');
    }
    await this.channelRepository.softDelete({ id: channelId });
  }
}

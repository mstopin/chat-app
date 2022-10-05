import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserId } from '../../../common/decorators/UserId';

import { AuthGuard } from '../../auth/guards/AuthGuard';

import { ChannelService } from '../services/ChannelService';

import { CreateChannelRequest } from './requests/CreateChannelRequest';
import { JoinChannelRequest } from './requests/JoinChannelReques';
import { ChannelResponse } from './responses/ChannelResponse';

@Controller('/channels')
@UseGuards(AuthGuard)
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  async getChannels() {
    const channels = await this.channelService.findAll();
    return channels.map((channel) => ChannelResponse.from(channel));
  }

  @Get('/deleted')
  async getChannelDeletedAndAccessibleForUser(@UserId() userId: string) {
    const channels =
      await this.channelService.findAllDeletedAndAccessibleForUser(userId);
    return channels.map((channel) => ChannelResponse.from(channel));
  }

  @Post()
  async createChannel(
    @UserId() userId: string,
    @Body() createChannelRequest: CreateChannelRequest
  ) {
    const { name, password } = createChannelRequest;
    const channel = await this.channelService.create({
      name,
      password,
      ownerId: userId,
    });
    return ChannelResponse.from(channel);
  }

  @Delete('/:channelId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteChannel(
    @UserId() userId: string,
    @Param('channelId') channelId: string
  ) {
    await this.channelService.delete({
      ownerId: userId,
      channelId,
    });
  }

  @Post('/:channelId/join')
  async joinChannel(
    @UserId() userId: string,
    @Param('channelId') channelId: string,
    @Body() joinChannelRequest: JoinChannelRequest
  ) {
    const { password } = joinChannelRequest;
    await this.channelService.join({
      userId,
      channelId,
      password,
    });
    return {
      success: true,
    };
  }

  @Post('/:channelId/leave')
  async leaveChannel(
    @UserId() userId: string,
    @Param('channelId') channelId: string
  ) {
    await this.channelService.leave({
      userId,
      channelId,
    });
    return {
      success: true,
    };
  }
}

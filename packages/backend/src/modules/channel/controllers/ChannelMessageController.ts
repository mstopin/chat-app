import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { UserId } from '../../../common/decorators/UserId';

import { AuthGuard } from '../../auth/guards/AuthGuard';

import { ChannelMessageService } from '../services/ChannelMessageService';
import { SendMessageRequest } from './requests/SendMessageRequest';
import { MessageResponse } from './responses/MessageResponse';

@Controller('/channels/:channelId/messages')
@UseGuards(AuthGuard)
export class ChannelMessageController {
  constructor(private channelMessageService: ChannelMessageService) {}

  @Get()
  async getMessages(
    @UserId() userId: string,
    @Param('channelId') channelId: string
  ) {
    const messages = await this.channelMessageService.getAll({
      userId,
      channelId,
    });
    return messages.map(MessageResponse.from);
  }

  @Post()
  async sendMessage(
    @UserId() userId: string,
    @Param('channelId') channelId: string,
    @Body() sendMessageRequest: SendMessageRequest
  ) {
    const message = await this.channelMessageService.send({
      userId,
      channelId,
      content: sendMessageRequest.content,
    });
    return MessageResponse.from(message);
  }
}

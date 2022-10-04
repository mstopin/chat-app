import { Controller, Get, UseGuards } from '@nestjs/common';

import { UserId } from '../../../common/decorators/UserId';

import { AuthGuard } from '../../auth/guards/AuthGuard';

import { EventService } from '../services/EventService';

@Controller('/events')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private eventService: EventService) {}

  @Get('/access-token')
  async getAccessToken(@UserId() userId: string) {
    const accessToken = await this.eventService.getOrCreateAccessToken(userId);

    return {
      access_token: accessToken,
    };
  }
}

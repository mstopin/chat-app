import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { RedisService, RedisClient } from '../../../common/modules/redis';

import { UserService } from '../../user/services/UserService';

import { Event } from '../events/Event';

@Injectable()
export class EventService {
  private static KEY_TTL = 1800;

  private redisClient: RedisClient;

  constructor(private userService: UserService, redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  async getOrCreateAccessToken(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const userTokenKey = `events.users.${userId}.token`;
    if (await this.redisClient.exists(userTokenKey, user.id)) {
      return this.redisClient.get(userTokenKey);
    }

    const accessToken = uuidv4();
    const tokenUserKey = `events.tokens.${accessToken}.user`;

    await this.redisClient
      .multi()
      .setex(userTokenKey, EventService.KEY_TTL, accessToken)
      .setex(tokenUserKey, EventService.KEY_TTL, accessToken)
      .exec();

    return accessToken;
  }

  async publish(event: Event) {
    const CHANNEL_NAME = 'events';
    this.redisClient.publish(CHANNEL_NAME, JSON.stringify(event));
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventService } from '../../event/services/EventService';

import { Message } from '../entities/Message';
import { NewMessageEvent } from '../events/NewMessageEvent';

import { CreateMessageDTO } from './dtos/CreateMessageDTO';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private eventService: EventService
  ) {}

  async createMessage(createMessageDTO: CreateMessageDTO) {
    const { user, channel, content } = createMessageDTO;
    const message = await this.messageRepository.save({
      sender: user,
      channel,
      content,
    });

    this.eventService.publish(new NewMessageEvent(user, channel, message));

    return message;
  }
}

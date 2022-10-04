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

    const recipientIds =
      user.id === channel.owner.id
        ? channel.members.map((m) => m.id)
        : [
            channel.owner.id,
            ...channel.members.flatMap((m) => (m.id === user.id ? [] : m.id)),
          ];
    this.eventService.publish(<NewMessageEvent>{
      type: 'NEW_MESSAGE',
      recipientIds: recipientIds,
      payload: {
        channel: {
          id: channel.id,
        },
        message: {
          id: message.id,
          content: message.content,
          created_at: message.created_at.toISOString(),
          sender: {
            id: user.id,
            name: user.name,
            surname: user.surname,
          },
        },
      },
    });

    return message;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from '../entities/Message';

import { CreateMessageDTO } from './dtos/CreateMessageDTO';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>
  ) {}

  async createMessage(createMessageDTO: CreateMessageDTO) {
    const { user, channel, content } = createMessageDTO;
    const message = await this.messageRepository.save({
      sender: user,
      channel,
      content,
    });
    return message;
  }
}

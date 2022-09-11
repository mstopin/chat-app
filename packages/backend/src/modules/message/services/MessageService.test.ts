import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from '../../../common/tests/MockType';

import { Channel } from '../../channel/entities/Channel';
import { User } from '../../user/entities/User';

import { Message } from '../entities/Message';

import { MessageService } from './MessageService';

let users: [User];
let channels: [Channel];

type MessageRepositoryMock = MockType<Repository<Message>>;

const createMessageRepositoryMock: () => MessageRepositoryMock = () => ({
  save: jest.fn((data) => data),
});

describe('MessageService', () => {
  let messageRepositoryMock: MessageRepositoryMock;
  let messageService: MessageService;

  beforeEach(async () => {
    users = [new User('user-id-1', 'email', 'password', 'name', 'surname')];
    channels = [
      new Channel('channel-id-1', users[0], 'name', 'password', [], []),
    ];
    messageRepositoryMock = createMessageRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getRepositoryToken(Message),
          useValue: messageRepositoryMock,
        },
      ],
    }).compile();

    messageService = moduleRef.get<MessageService>(MessageService);
  });

  describe('createMessage', () => {
    const createMessage = async () => {
      return await messageService.createMessage({
        user: users[0],
        channel: channels[0],
        content: 'content',
      });
    };

    it('returns created message', async () => {
      const message = await createMessage();

      expect(message.sender).toBe(users[0]);
      expect(message.channel).toBe(channels[0]);
      expect(message.content).toBe('content');
    });

    it('saves message to database', async () => {
      await createMessage();

      expect(messageRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(messageRepositoryMock.save).toHaveBeenCalledWith({
        sender: users[0],
        channel: channels[0],
        content: 'content',
      });
    });
  });
});

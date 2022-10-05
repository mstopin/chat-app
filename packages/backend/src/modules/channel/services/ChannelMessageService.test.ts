import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MockType } from '../../../common/tests/MockType';

import { User } from '../../user/entities/User';
import { UserService } from '../../user/services/UserService';
import { Message } from '../../message/entities/Message';
import { MessageService } from '../../message/services/MessageService';

import { Channel } from '../entities/Channel';

import { ChannelMessageService } from './ChannelMessageService';

let users: [User, User, User];
let channels: [Channel];
let messages: [Message];

type UserServiceMock = MockType<UserService>;
type MessageServiceMock = MockType<MessageService>;
type ChannelRepositoryMock = MockType<Repository<Channel>>;

const createUserServiceMock: () => UserServiceMock = () => ({
  findById: jest.fn((id: string) => {
    return users.find((u) => u.id === id) ?? null;
  }),
});

const createMessageServiceMock: () => MessageServiceMock = () => ({
  createMessage: jest.fn((data) => data),
});

const createChannelRepositoryMock: () => ChannelRepositoryMock = () => {
  interface FindParams {
    where?: {
      members?: {
        id?: string;
      };
    };
    withDeleted?: boolean;
  }

  type FindOneParams = FindParams & {
    where: {
      id: string;
    };
  };

  return {
    find: jest.fn(({ where, withDeleted }: FindParams) => {
      return channels
        .filter((c) => (withDeleted ? true : !c.deleted_at))
        .filter((c) =>
          where?.members?.id
            ? !!c.members.find((m) => m.id === where!.members!.id)
            : true
        );
    }),
    findOne: jest.fn(({ where, withDeleted }: FindOneParams) => {
      return (
        channels
          .filter((c) => (withDeleted ? true : !c.deleted_at))
          .find((c) => c.id === where.id) ?? null
      );
    }),
    save: jest.fn((data) => data),
    softDelete: jest.fn(),
  };
};

describe('ChannelMessageService', () => {
  let userServiceMock: UserServiceMock;
  let messageServiceMock: MessageServiceMock;
  let channelRepositoryMock: ChannelRepositoryMock;
  let channelMessageService: ChannelMessageService;

  beforeEach(async () => {
    users = [
      new User('user-id-1', 'email-1', 'password-1', 'name-1', 'surname-1'),
      new User('user-id-2', 'email-2', 'password-2', 'name-2', 'surname-2'),
      new User('user-id-3', 'email-3', 'password-3', 'name-3', 'surname-3'),
    ];
    channels = [
      new Channel('channel-id-1', users[0], 'name-1', null, [users[1]], []),
    ];
    messages = [new Message('message-id-1', 'content', users[0], channels[0])];
    channels[0].messages.push(messages[0]);

    userServiceMock = createUserServiceMock();
    messageServiceMock = createMessageServiceMock();
    channelRepositoryMock = createChannelRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChannelMessageService,
        { provide: UserService, useValue: userServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        {
          provide: getRepositoryToken(Channel),
          useValue: channelRepositoryMock,
        },
      ],
    }).compile();

    channelMessageService = moduleRef.get<ChannelMessageService>(
      ChannelMessageService
    );
  });

  const assertChecksIfUserExists = (userId: string) => {
    expect(userServiceMock.findById).toHaveBeenCalledTimes(1);
    expect(userServiceMock.findById).toHaveBeenCalledWith(userId);
  };

  const assertThrowsIfUserDoesNotExist = async (cb: () => unknown) => {
    await expect(async () => {
      await cb();
    }).rejects.toThrow('User does not exist');
  };

  const assertChecksIfChannelExists = (
    channelId: string,
    withDeleted = false,
    withMessages = false
  ) => {
    expect(channelRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    expect(channelRepositoryMock.findOne).toHaveBeenCalledWith({
      relations: {
        owner: true,
        members: true,
        messages: withMessages,
      },
      where: {
        id: channelId,
      },
      withDeleted,
    });
  };

  const assertThrowsIfChannelDoesNotExist = async (cb: () => unknown) => {
    await expect(async () => {
      await cb();
    }).rejects.toThrow('Channel does not exist');
  };

  describe('getAll', () => {
    const getAll = async (userId: string, channelId = 'channel-id-1') => {
      return await channelMessageService.getAll({
        userId,
        channelId,
      });
    };

    it('checks if user exists', async () => {
      await getAll('user-id-1');
      assertChecksIfUserExists('user-id-1');
    });

    it('checks if channel exists', async () => {
      await getAll('user-id-1');
      assertChecksIfChannelExists('channel-id-1', true, true);
    });

    it('throws if user does not exist', async () => {
      await assertThrowsIfUserDoesNotExist(async () => {
        await getAll('user-id-4');
      });
    });

    it('throws if channel does not exist', async () => {
      await assertThrowsIfChannelDoesNotExist(async () => {
        await getAll('user-id-1', 'channel-id-2');
      });
    });

    it('returns all messages if user is an owner', async () => {
      const foundMessages = await getAll('user-id-1');

      expect(foundMessages.length).toBe(1);
      expect(foundMessages[0]!.id).toBe(messages[0].id);
    });

    it('returns all messages if user is a member', async () => {
      const foundMessages = await getAll('user-id-2');

      expect(foundMessages.length).toBe(1);
      expect(foundMessages[0]!.id).toBe(messages[0].id);
    });

    it('throws if user is neither a member nor an owner', async () => {
      await expect(async () => {
        await getAll('user-id-3');
      }).rejects.toThrow('You are not a member of this channel');
    });
  });

  describe('send', () => {
    const sendMessage = async (userId: string, channelId = 'channel-id-1') => {
      await channelMessageService.send({
        userId,
        channelId,
        content: 'content',
      });
    };

    it('checks if user exists', async () => {
      await sendMessage('user-id-1');
      assertChecksIfUserExists('user-id-1');
    });

    it('checks if channel exists', async () => {
      await sendMessage('user-id-1');
      assertChecksIfChannelExists('channel-id-1');
    });

    it('throws if user does not exist', async () => {
      await assertThrowsIfUserDoesNotExist(async () => {
        await sendMessage('user-id-4');
      });
    });

    it('throws if channel does not exist', async () => {
      await assertThrowsIfChannelDoesNotExist(async () => {
        await sendMessage('user-id-1', 'channel-id-2');
      });
    });

    it('sends message if user is an owner', async () => {
      await sendMessage('user-id-1');

      expect(messageServiceMock.createMessage).toHaveBeenCalledTimes(1);
      expect(messageServiceMock.createMessage).toHaveBeenCalledWith({
        user: users[0],
        channel: channels[0],
        content: 'content',
      });
    });

    it('sends message if user is a member', async () => {
      await sendMessage('user-id-2');

      expect(messageServiceMock.createMessage).toHaveBeenCalledTimes(1);
      expect(messageServiceMock.createMessage).toHaveBeenCalledWith({
        user: users[1],
        channel: channels[0],
        content: 'content',
      });
    });

    it('throws if user is neither a member nor an owner', async () => {
      await expect(async () => {
        await sendMessage('user-id-3');
      }).rejects.toThrow('You are not a member of this channel');
    });
  });
});

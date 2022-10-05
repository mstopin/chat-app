import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  HashingService,
  PassthroughHashingService,
} from '../../../common/modules/HashingModule';
import { MockType } from '../../../common/tests/MockType';

import { User } from '../../user/entities/User';
import { UserService } from '../../user/services/UserService';

import { Channel } from '../entities/Channel';

import { ChannelService } from './ChannelService';

let users: User[];
let channels: Channel[];

type UserServiceMock = MockType<UserService>;
type ChannelRepositoryMock = MockType<Repository<Channel>>;

const createUserServiceMock: () => UserServiceMock = () => ({
  findById: jest.fn((id: string) => {
    return users.find((u) => u.id === id) ?? null;
  }),
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

describe('ChannelService', () => {
  let userServiceMock: UserServiceMock;
  let channelRepositoryMock: ChannelRepositoryMock;
  let hashingService: HashingService;
  let channelService: ChannelService;

  beforeEach(async () => {
    users = [
      new User('user-id-1', 'email-1', 'password-1', 'name-1', 'surname-1'),
      new User('user-id-2', 'email-2', 'password-2', 'name-2', 'surname-2'),
    ];
    channels = [
      new Channel('channel-id-1', users[0], 'name-1', null, [], []),
      new Channel('channel-id-2', users[0], 'name-2', 'password-2', [], []),
      new Channel(
        'channel-id-3',
        users[0],
        'name-3',
        null,
        [users[1]!],
        [],
        new Date()
      ),
    ];

    userServiceMock = createUserServiceMock();
    channelRepositoryMock = createChannelRepositoryMock();
    hashingService = new PassthroughHashingService();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChannelService,
        { provide: UserService, useValue: userServiceMock },
        { provide: HashingService, useValue: hashingService },
        {
          provide: getRepositoryToken(Channel),
          useValue: channelRepositoryMock,
        },
      ],
    }).compile();

    channelService = moduleRef.get<ChannelService>(ChannelService);
  });

  describe('findAll', () => {
    it('returns not deleted channels', async () => {
      const foundChannels = await channelService.findAll();

      expect(foundChannels).toStrictEqual(
        channels.filter((c) => !c.deleted_at)
      );
    });
  });

  describe('findAllDeletedAndAccessibleForUser', () => {
    it('returns channels for members of deleted channels', async () => {
      const foundChannels =
        await channelService.findAllDeletedAndAccessibleForUser('user-id-2');

      expect(foundChannels).toStrictEqual([channels[2]]);
    });

    it('does not return channels for owners of deleted channels', async () => {
      const foundChannels =
        await channelService.findAllDeletedAndAccessibleForUser('user-id-3');

      expect(foundChannels).toStrictEqual([]);
    });
  });

  describe('create', () => {
    const createChannel = async (ownerId: string, password: string | null) => {
      return await channelService.create({
        ownerId,
        password,
        name: 'name',
      });
    };

    it('check if user exists', async () => {
      await createChannel('user-id-1', null);

      expect(userServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findById).toHaveBeenCalledWith('user-id-1');
    });

    it('throws if user does not exist', async () => {
      await expect(async () => {
        await createChannel('user-id-3', null);
      }).rejects.toThrow('User does not exist');
    });

    it('saves new channel to database', async () => {
      await createChannel('user-id-1', null);

      expect(channelRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.save).toHaveBeenCalledWith({
        name: 'name',
        password: null,
        owner: users[0],
        members: [],
      });
    });

    it('computes password hash if channel is password protected', async () => {
      const spy = jest.spyOn(hashingService, 'hash');

      await createChannel('user-id-1', 'password');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('password', 10);
    });

    it('returns created channel', async () => {
      const channel = await createChannel('user-id-1', null);

      expect(channel).toBeDefined();
      expect(channel.name).toBe('name');
      expect(channel.password).toBe(null);
      expect(channel.owner).toBe(users[0]);
    });
  });

  describe('delete', () => {
    const deleteChannel = async (ownerId: string, channelId: string) => {
      await channelService.delete({
        ownerId,
        channelId,
      });
    };

    it('checks if user exists', async () => {
      await deleteChannel('user-id-1', 'channel-id-1');

      expect(userServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findById).toHaveBeenCalledWith('user-id-1');
    });

    it('throws if user does not exist', async () => {
      await expect(async () => {
        await deleteChannel('user-id-3', 'channel-id-1');
      }).rejects.toThrow('User does not exist');
    });

    it('checks if channel exists', async () => {
      await deleteChannel('user-id-1', 'channel-id-1');

      expect(channelRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: {
          owner: true,
          members: false,
          messages: false,
        },
        where: {
          id: 'channel-id-1',
        },
        withDeleted: false,
      });
    });

    it('throws if channel does not exist', async () => {
      await expect(async () => {
        await deleteChannel('user-id-1', 'channel-id-4');
      }).rejects.toThrow('Channel does not exist');
    });

    it('soft deletes channel', async () => {
      await deleteChannel('user-id-1', 'channel-id-1');

      expect(channelRepositoryMock.softDelete).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.softDelete).toHaveBeenCalledWith({
        id: 'channel-id-1',
      });
    });

    it('throws if user does not own the channel', async () => {
      await expect(async () => {
        await deleteChannel('user-id-2', 'channel-id-1');
      }).rejects.toThrow('You do not own this channel');
    });
  });

  describe('join', () => {
    const joinChannel = async (
      userId: string,
      channelId: string,
      password: string | null
    ) => {
      await channelService.join({
        userId,
        channelId,
        password,
      });
    };

    it('check if user exists', async () => {
      await joinChannel('user-id-2', 'channel-id-1', null);

      expect(userServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findById).toHaveBeenCalledWith('user-id-2');
    });

    it('throws if user does not exist', async () => {
      await expect(async () => {
        await joinChannel('user-id-3', 'channel-id-1', null);
      }).rejects.toThrow('User does not exist');
    });

    it('checks if channel exists', async () => {
      await joinChannel('user-id-2', 'channel-id-1', null);

      expect(channelRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: {
          owner: true,
          members: true,
          messages: false,
        },
        where: {
          id: 'channel-id-1',
        },
        withDeleted: true,
      });
    });

    it('throws if channel does not exist', async () => {
      await expect(async () => {
        await joinChannel('user-id-2', 'channel-id-4', null);
      }).rejects.toThrow('Channel does not exist');
    });

    it('adds new user to channel', async () => {
      await joinChannel('user-id-2', 'channel-id-1', null);

      expect(channelRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.save).toHaveBeenCalledWith({
        ...channels[0],
        members: [users[1]],
      });
    });

    it('throws if user has already joined the channel', async () => {
      channels[0]?.members.push(users[1] as User);

      await expect(async () => {
        await joinChannel('user-id-2', 'channel-id-1', null);
      }).rejects.toThrow('You have already joined this channel');
    });

    it('throws if owner tries to join their own channel', async () => {
      await expect(async () => {
        await joinChannel('user-id-1', 'channel-id-1', null);
      }).rejects.toThrow('You cannot join your own channel');
    });

    it('computes password hash if channels has password', async () => {
      const spy = jest.spyOn(hashingService, 'compare');
      await joinChannel('user-id-2', 'channel-id-2', 'password-2');

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('password-2', 'password-2');
    });

    it('throws if joining protected channel without password', async () => {
      await expect(async () => {
        await joinChannel('user-id-2', 'channel-id-2', null);
      }).rejects.toThrow('Invalid password');
    });

    it('throws if joining protected channel with invalid password', async () => {
      await expect(async () => {
        await joinChannel('user-id-2', 'channel-id-2', 'password-3');
      }).rejects.toThrow('Invalid password');
    });

    it('throws if joining deleted channel', async () => {
      await expect(async () => {
        await joinChannel('user-id-2', 'channel-id-3', null);
      }).rejects.toThrow('Channel has been deleted');
    });
  });

  describe('leave', () => {
    const leaveChannel = async (userId: string, channelId: string) => {
      await channelService.leave({
        userId,
        channelId,
      });
    };

    beforeEach(() => {
      channels[0]?.members.push(users[1] as User);
    });

    it('checks if user exists', async () => {
      await leaveChannel('user-id-2', 'channel-id-1');

      expect(userServiceMock.findById).toHaveBeenCalledTimes(1);
      expect(userServiceMock.findById).toHaveBeenCalledWith('user-id-2');
    });

    it('throws if user does not exist', async () => {
      await expect(async () => {
        await leaveChannel('user-id-3', 'channel-id-1');
      }).rejects.toThrow('User does not exist');
    });

    it('checks if channel exists', async () => {
      await leaveChannel('user-id-2', 'channel-id-1');

      expect(channelRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: {
          owner: true,
          members: true,
          messages: false,
        },
        where: {
          id: 'channel-id-1',
        },
        withDeleted: true,
      });
    });

    it('throws if channel does not exist', async () => {
      await expect(async () => {
        await leaveChannel('user-id-2', 'channel-id-4');
      }).rejects.toThrow('Channel does not exist');
    });

    it('removes user from channel', async () => {
      await leaveChannel('user-id-2', 'channel-id-1');

      expect(channelRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.save).toHaveBeenCalledWith({
        ...channels[0],
        members: [],
      });
    });

    it('throws if user is not a member of the channel', async () => {
      channels[0]!.members = [];

      await expect(async () => {
        await leaveChannel('user-id-2', 'channel-id-1');
      }).rejects.toThrow('You are not a member of this channel');
    });

    it('throws if owner tries to leave their own channel', async () => {
      await expect(async () => {
        await leaveChannel('user-id-1', 'channel-id-1');
      }).rejects.toThrow(
        'You cannot leave your own channel. Delete it instead.'
      );
    });

    it('throws if owner tries to leave their own deleted channel', async () => {
      await expect(async () => {
        await leaveChannel('user-id-1', 'channel-id-3');
      }).rejects.toThrow('Channel has been deleted.');
    });

    it('removes user from deleted channel', async () => {
      await leaveChannel('user-id-2', 'channel-id-3');

      expect(channelRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.save).toHaveBeenCalledWith({
        ...channels[2],
        members: [],
      });
    });
  });
});

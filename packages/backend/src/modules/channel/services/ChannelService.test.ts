import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  HashingService,
  PassthroughHashingService,
} from '../../../common/modules/HashingModule';
import { User } from '../../user/entities/User';

import { UserService } from '../../user/services/UserService';

import { Channel } from '../entities/Channel';

import { ChannelService } from './ChannelService';

const users: User[] = [
  new User('user-id-1', 'email-1', 'password-1', 'name-1', 'surname-1'),
  new User('user-id-2', 'email-2', 'password-2', 'name-2', 'surname-2'),
];

const channels: Channel[] = [
  new Channel('channel-id-1', users[0], 'name-1', null, []),
];

type UserServiceMock = {
  [K in keyof Partial<UserService>]?: jest.Mock;
};

type ChannelRepositoryMock = {
  [K in keyof Partial<Repository<Channel>>]?: jest.Mock;
};

const createUserServiceMock: () => UserServiceMock = () => ({
  findById: jest.fn((id: string) => {
    return users.find((u) => u.id === id) ?? null;
  }),
});

const createChannelRepositoryMock: () => ChannelRepositoryMock = () => {
  return {
    find: jest.fn(() => channels),
    findOne: jest.fn(({ where: { id } }: { where: { id: string } }) => {
      return channels.find((c) => c.id === id) ?? null;
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
    const createExpectedCallObject = (
      withOwner: boolean,
      withMembers: boolean
    ) => ({
      relations: {
        owner: !!withOwner,
        members: !!withMembers,
      },
    });

    it('returns all channels', async () => {
      const foundChannels = await channelService.findAll();

      expect(foundChannels).toBe(channels);
    });

    it('loads channels without relations', async () => {
      await channelService.findAll({});

      expect(channelRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.find).toHaveBeenCalledWith(
        createExpectedCallObject(false, false)
      );
    });

    it('loads channels with owner relation', async () => {
      await channelService.findAll({ withOwner: true });

      expect(channelRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.find).toHaveBeenCalledWith(
        createExpectedCallObject(true, false)
      );
    });

    it('loads channels with members relation', async () => {
      await channelService.findAll({ withMembers: true });

      expect(channelRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(channelRepositoryMock.find).toHaveBeenCalledWith(
        createExpectedCallObject(false, true)
      );
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
        },
        where: {
          id: 'channel-id-1',
        },
      });
    });

    it('throws if channel does not exist', async () => {
      await expect(async () => {
        await deleteChannel('user-id-1', 'channel-id-2');
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
});

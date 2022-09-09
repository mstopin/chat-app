import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  HashingService,
  PassthroughHashingService,
} from '../../../common/modules/HashingModule';

import { User } from '../entities/User';

import { UserService } from './UserService';

type UserRepositoryMock = {
  [K in keyof Partial<Repository<User>>]?: jest.Mock;
};

const createUserRepositoryMock: () => UserRepositoryMock = () => ({
  findOneBy: jest.fn(({ email }: { email?: string }) => {
    if (email && email === 'email') {
      return new User('id', 'email', 'password', 'name', 'surname');
    }
    return null;
  }),
  save: jest.fn(
    ({
      email,
      password,
      name,
      surname,
    }: {
      email: string;
      password: string;
      name: string;
      surname: string;
    }) => {
      return {
        id: 'id',
        email,
        password,
        name,
        surname,
      };
    }
  ),
});

describe('UserService', () => {
  let userRepositoryMock: UserRepositoryMock;
  let userService: UserService;

  beforeEach(async () => {
    userRepositoryMock = createUserRepositoryMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: userRepositoryMock },
        { provide: HashingService, useClass: PassthroughHashingService },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it('can find user by email', async () => {
    const user = (await userService.findByEmail('email')) as User;

    expect(user.id).toBe('id');
    expect(user.email).toBe('email');
    expect(user.password).toBe('password');
  });

  it('can register user if email is not registered', async () => {
    const user = await userService.registerUser({
      email: 'email2',
      password: 'password2',
      name: 'name',
      surname: 'surname',
    });

    expect(user.id).toBe('id');
    expect(user.email).toBe('email2');
    expect(user.password).toEqual('password2');
  });

  it('cannot register user if email is already registered', async () => {
    await expect(async () => {
      await userService.registerUser({
        email: 'email',
        password: 'password',
        name: 'name',
        surname: 'surname',
      });
    }).rejects.toThrow('User already exists');
  });
});

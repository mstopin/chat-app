import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

import {
  HashingService,
  PassthroughHashingService,
} from '../../../common/modules/HashingModule';
import { User } from '../../user/entities/User';

import { UserService } from '../../user/services/UserService';

import { AuthService } from './AuthService';

type UserServiceMock = {
  [K in keyof Partial<UserService>]?: jest.Mock;
};

const createUserServiceMock: () => UserServiceMock = () => ({
  findByEmail: jest.fn((email: string) => {
    if (email === 'email') {
      return new User('id', 'email', 'password');
    }
    return null;
  }),
});

describe('AuthService', () => {
  let userServiceMock: UserServiceMock;
  let authService: AuthService;

  beforeEach(async () => {
    userServiceMock = createUserServiceMock();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userServiceMock },
        { provide: HashingService, useClass: PassthroughHashingService },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('returns user when given valid credentials', async () => {
    const user = (await authService.validateCredentialsAndGetUser(
      'email',
      'password'
    )) as User;

    expect(user.id).toBe('id');
    expect(user.email).toBe('email');
    expect(user.password).toBe('password');
  });

  it('throws exception when given invalid email', async () => {
    await expect(async () => {
      await authService.validateCredentialsAndGetUser('email2', 'password');
    }).rejects.toThrow(UnauthorizedException);
  });

  it('throws exception when given invalid password', async () => {
    await expect(async () => {
      await authService.validateCredentialsAndGetUser('email', 'password2');
    }).rejects.toThrow(UnauthorizedException);
  });
});

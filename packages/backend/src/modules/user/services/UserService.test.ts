import { Test } from '@nestjs/testing';

import { USER_REPOSITORY_TOKEN } from '../repositories/UserRepository';
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository';
import { User } from '../entities/User';

import { UserService } from './UserService';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: InMemoryUserRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY_TOKEN, useClass: InMemoryUserRepository },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<InMemoryUserRepository>(
      USER_REPOSITORY_TOKEN
    );
  });

  it('can find user by email', async () => {
    userRepository.users.push(new User('id', 'email', 'password'));

    const user = (await userService.findByEmail('email')) as User;
    expect(user.id).toBe('id');
    expect(user.email).toBe('email');
  });

  it('can register user if email is not registered', async () => {
    const user = await userService.registerUser({
      email: 'email',
      password: 'password',
    });

    expect(userRepository.users.length).toBe(1);
    expect(userRepository.users[0]?.id).toBe(user.id);
    expect(userRepository.users[0]?.email).toBe(user.email);
    expect(userRepository.users[0]?.password).toBe(user.password);
  });

  it('cannot register user if email is already registered', async () => {
    userRepository.users.push(new User('id', 'email', 'password'));

    await expect(
      userService.registerUser({
        email: 'email',
        password: 'password',
      })
    ).rejects.toThrow('User already exists');
  });
});

import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import {
  UserRepository,
  USER_REPOSITORY_TOKEN,
} from '../repositories/UserRepository';

import { RegisterUserDTO } from './dtos/RegisterUserDTO';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private userRepository: UserRepository
  ) {}

  async findByEmail(email: string) {
    const exactEmailUser = await this.userRepository.findByEmail(email);
    return exactEmailUser;
  }

  async registerUser(registerUserDTO: RegisterUserDTO) {
    const { email, password } = registerUserDTO;
    const exactEmailUser = await this.findByEmail(email);
    if (exactEmailUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const registeredUser = await this.userRepository.create({
      email,
      password: passwordHash,
    });

    return registeredUser;
  }
}

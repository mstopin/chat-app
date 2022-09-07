import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

import { User } from '../entities/User';

import { RegisterUserDTO } from './dtos/RegisterUserDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findByEmail(email: string) {
    const exactEmailUser = await this.userRepository.findOneBy({ email });
    return exactEmailUser;
  }

  async registerUser(registerUserDTO: RegisterUserDTO) {
    const { email, password } = registerUserDTO;
    const exactEmailUser = await this.findByEmail(email);
    if (exactEmailUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const registeredUser = await this.userRepository.save({
      email,
      password: passwordHash,
    });

    return registeredUser;
  }
}

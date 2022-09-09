import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HashingService } from '../../../common/modules/HashingModule/services/HashingService';

import { User } from '../entities/User';

import { RegisterUserDTO } from './dtos/RegisterUserDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private hashingService: HashingService
  ) {}

  async findByEmail(email: string) {
    const exactEmailUser = await this.userRepository.findOneBy({ email });
    return exactEmailUser;
  }

  async registerUser(registerUserDTO: RegisterUserDTO) {
    const { email, password, name, surname } = registerUserDTO;
    const exactEmailUser = await this.findByEmail(email);
    if (exactEmailUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const passwordHash = await this.hashingService.hash(password, 10);
    const registeredUser = await this.userRepository.save({
      email,
      password: passwordHash,
      name,
      surname,
    });

    return registeredUser;
  }
}

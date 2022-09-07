import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/User';

import { UserRepository, CreateUserDTO, UpdateUserDTO } from './UserRepository';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async find() {
    return await this.userRepository.find({});
  }

  async findById(id: string) {
    return await this.userRepository.findOneBy({ id });
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async create(createUserDTO: CreateUserDTO) {
    return await this.userRepository.save(createUserDTO);
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    await this.userRepository.update({ id }, updateUserDTO);
    return Promise.resolve();
  }

  async delete(id: string) {
    await this.userRepository.delete({ id });
    return Promise.resolve();
  }
}

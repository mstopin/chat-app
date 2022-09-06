import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../entities/User';

import { UserRepository, CreateUserDTO, UpdateUserDTO } from './UserRepository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async find() {
    return Promise.resolve(this.users);
  }

  async findById(id: string) {
    return Promise.resolve(this.users.find((u) => u.id === id) ?? null);
  }

  async findByEmail(email: string) {
    return Promise.resolve(this.users.find((u) => u.email === email) ?? null);
  }

  async create(createUserDTO: CreateUserDTO) {
    const { email, password } = createUserDTO;
    const user = new User(uuidv4(), email, password);
    this.users.push(user);
    return Promise.resolve(user);
  }

  async update(id: string, updateUserDTO: UpdateUserDTO) {
    const { email, password } = updateUserDTO;
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      return;
    }
    const userIndex = this.users.findIndex((u) => u.id === id);
    this.users[userIndex] = new User(
      id,
      email ?? user.email,
      password ?? user.password
    );
    return Promise.resolve();
  }

  async delete(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
    return Promise.resolve();
  }
}

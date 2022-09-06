import { EntityRepository } from '../../common/repositories/EntityRepository';

import { User } from '../entities/User';

export interface CreateUserDTO {
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
}

export interface UserRepository
  extends EntityRepository<User, CreateUserDTO, UpdateUserDTO> {
  findByEmail: (email: string) => Promise<User | null>;
}

export const USER_REPOSITORY_TOKEN = Symbol.for('UserRepository');

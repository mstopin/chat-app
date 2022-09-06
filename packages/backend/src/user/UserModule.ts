import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/User';
import { UserService } from './services/UserService';
import { USER_REPOSITORY_TOKEN } from './repositories/UserRepository';
import { TypeOrmUserRepository } from './repositories/TypeOrmUserRepository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class UserModule {}

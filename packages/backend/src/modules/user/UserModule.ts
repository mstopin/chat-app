import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/User';
import { UserService } from './services/UserService';
import { USER_REPOSITORY_TOKEN } from './repositories/UserRepository';
import { TypeOrmUserRepository } from './repositories/TypeOrmUserRepository';
import { UserController } from './controllers/UserController';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: TypeOrmUserRepository,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}

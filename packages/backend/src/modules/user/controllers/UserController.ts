import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from '../services/UserService';

import { RegisterUserRequest } from './requests/RegisterUserRequest';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() registerUserRequest: RegisterUserRequest) {
    const { email, password, name, surname } = registerUserRequest;
    const user = await this.userService.registerUser({
      email,
      password,
      name,
      surname,
    });
    return {
      email: user.email,
      name: user.name,
      surname: user.surname,
    };
  }
}

import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from '../services/UserService';

import { RegisterUserRequest } from './requests/RegisterUserRequest';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  async register(@Body() registerUserRequest: RegisterUserRequest) {
    const { email, password } = registerUserRequest;
    const user = await this.userService.registerUser({
      email,
      password,
    });
    return {
      email: user.email,
    };
  }
}

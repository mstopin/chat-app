import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

import { UserId } from '../../../common/decorators/UserId';

import { UserService } from '../../user/services/UserService';

import { AuthService } from '../services/AuthService';
import { AuthGuard } from '../guards/AuthGuard';

import { LoginUserRequest } from './requests/LoginUserRequest';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Get('/me')
  @UseGuards(AuthGuard)
  async getAuthUser(@UserId() userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new InternalServerErrorException();
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
    };
  }

  @Post('/login')
  async login(@Req() req: Request, @Body() loginUserRequest: LoginUserRequest) {
    const { email, password } = loginUserRequest;
    const user = await this.authService.validateCredentialsAndGetUser(
      email,
      password
    );

    req.session.user = {
      id: user.id,
    };

    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request) {
    delete req.session.user;

    return {
      success: true,
    };
  }
}

import { Controller, Post, UseGuards, Body, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from '../services/AuthService';
import { LoginUserRequest } from './requests/LoginUserRequest';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';

import { UserService } from '../../user/services/UserService';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateCredentialsAndGetUser(email: string, password: string) {
    const exactEmailUser = await this.userService.findByEmail(email);
    if (!exactEmailUser) {
      throw new UnauthorizedException();
    }
    if (!(await bcrypt.compare(password, exactEmailUser.password))) {
      throw new UnauthorizedException();
    }
    return exactEmailUser;
  }
}

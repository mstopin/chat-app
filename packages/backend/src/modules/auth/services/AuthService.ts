import { Injectable, UnauthorizedException } from '@nestjs/common';

import { HashingService } from '../../../common/modules/HashingModule';

import { UserService } from '../../user/services/UserService';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashingService: HashingService
  ) {}

  async validateCredentialsAndGetUser(email: string, password: string) {
    const exactEmailUser = await this.userService.findByEmail(email);
    if (!exactEmailUser) {
      throw new UnauthorizedException();
    }
    if (
      !(await this.hashingService.compare(password, exactEmailUser.password))
    ) {
      throw new UnauthorizedException();
    }
    return exactEmailUser;
  }
}

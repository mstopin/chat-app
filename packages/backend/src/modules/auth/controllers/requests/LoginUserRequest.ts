import { IsEmail, MinLength } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}

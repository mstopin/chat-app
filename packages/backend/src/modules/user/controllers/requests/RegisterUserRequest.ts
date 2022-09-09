import { IsEmail, MinLength, IsString } from 'class-validator';

export class RegisterUserRequest {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

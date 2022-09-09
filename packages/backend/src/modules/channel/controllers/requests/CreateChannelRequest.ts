import { IsString, MinLength, ValidateIf } from 'class-validator';

export class CreateChannelRequest {
  @IsString()
  name: string;

  @IsString()
  @MinLength(8)
  @ValidateIf((_, value) => value !== null)
  password: string | null;
}

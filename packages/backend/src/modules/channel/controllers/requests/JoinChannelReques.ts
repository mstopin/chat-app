import { IsString, ValidateIf } from 'class-validator';

export class JoinChannelRequest {
  @IsString()
  @ValidateIf((_, value) => value !== null)
  password: string | null;
}

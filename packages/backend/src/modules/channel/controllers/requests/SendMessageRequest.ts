import { IsString, MaxLength } from 'class-validator';

export class SendMessageRequest {
  @IsString()
  @MaxLength(2048)
  content: string;
}

import { User } from '../../../user/entities/User';
import { Channel } from '../../../channel/entities/Channel';

export interface CreateMessageDTO {
  user: User;
  channel: Channel;
  content: string;
}

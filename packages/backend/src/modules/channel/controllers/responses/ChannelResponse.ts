import { User } from '../../../user/entities/User';

import { Channel } from '../../entities/Channel';

export class ChannelResponse {
  private static serializeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
    };
  }

  static from(channel: Channel) {
    return {
      id: channel.id,
      name: channel.name,
      hasPassword: !!channel.password,
      owner: this.serializeUser(channel.owner),
      members: channel.members.map(this.serializeUser),
    };
  }
}

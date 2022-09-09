import { Channel } from '../../entities/Channel';

export class ChannelResponse {
  static from(channel: Channel) {
    return {
      id: channel.id,
      name: channel.name,
      hasPassword: !!channel.password,
      owner: {
        id: channel.owner.id,
        name: channel.owner.name,
        surname: channel.owner.surname,
      },
    };
  }
}

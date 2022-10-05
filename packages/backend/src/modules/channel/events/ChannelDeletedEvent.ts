import { Event } from '../../event/events/Event';

import { Channel } from '../entities/Channel';

interface ChannelDeletedEventPayload {
  channel: {
    id: string;
  };
}

export class ChannelDeletedEvent extends Event<ChannelDeletedEventPayload> {
  constructor(channel: Channel) {
    super(
      'CHANNEL_DELETED',
      channel.members.map((m) => m.id),
      { channel: { id: channel.id } }
    );
  }
}

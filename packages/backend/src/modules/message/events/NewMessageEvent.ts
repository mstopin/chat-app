import { Event } from '../../event/events/Event';

import { User } from '../../user/entities/User';
import { Channel } from '../../channel/entities/Channel';
import { Message } from '../entities/Message';

interface NewMessageEventPayload {
  channel: {
    id: string;
  };
  message: {
    id: string;
    content: string;
    created_at: string;
    sender: {
      id: string;
      name: string;
      surname: string;
    };
  };
}

export class NewMessageEvent extends Event<NewMessageEventPayload> {
  constructor(sender: User, channel: Channel, message: Message) {
    super(
      'NEW_MESSAGE',
      NewMessageEvent.getRecipientIds(channel, sender),
      NewMessageEvent.getPayload(channel, message, sender)
    );
  }

  private static getRecipientIds(channel: Channel, sender: User): string[] {
    if (channel.owner.id === sender.id) {
      return channel.members.map((m) => m.id);
    }
    return [
      channel.owner.id,
      ...channel.members.flatMap((m) => (m.id !== sender.id ? m.id : [])),
    ];
  }

  private static getPayload(
    c: Channel,
    m: Message,
    s: User
  ): NewMessageEventPayload {
    return {
      channel: {
        id: c.id,
      },
      message: {
        id: m.id,
        content: m.content,
        created_at: m.created_at.toISOString(),
        sender: {
          id: s.id,
          name: s.name,
          surname: s.surname,
        },
      },
    };
  }
}

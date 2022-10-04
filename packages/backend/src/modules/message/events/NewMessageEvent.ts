import { Event } from '../../event/events/Event';

export type NewMessageEvent = Event<{
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
}>;

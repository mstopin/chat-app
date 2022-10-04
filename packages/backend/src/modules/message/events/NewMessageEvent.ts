import { Event } from '../../event/events/Event';

export type NewMessageEvent = Event<{
  content: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    surname: string;
  };
}>;

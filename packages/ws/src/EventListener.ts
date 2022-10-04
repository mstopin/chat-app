import { Redis } from './Redis';

export interface Event {
  type: string;
  recipientIds: string[];
  payload: unknown;
}

type EventHandler = (event: Event) => void;

export class EventListener {
  private static EVENT_CHANNEL = 'events';

  private redis: Redis;
  private eventHandler: EventHandler | null;

  constructor(redis: Redis) {
    this.redis = redis;
    this.eventHandler = null;
  }

  setEventHandler(handler: EventHandler) {
    this.eventHandler = handler;
  }

  async start() {
    this.redis.getSubscriptionClient().on('message', (channel, message) => {
      if (channel !== EventListener.EVENT_CHANNEL && this.eventHandler) {
        const event = JSON.parse(message) as Event;
        this.eventHandler(event);
      }
    });

    await this.redis
      .getSubscriptionClient()
      .subscribe(EventListener.EVENT_CHANNEL);
  }
}

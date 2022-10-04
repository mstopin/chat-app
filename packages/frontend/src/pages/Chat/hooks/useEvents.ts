import { useRef, useEffect } from 'react';
import axios from 'axios';

import { useStore } from '../../../store';

interface NewMessageEvent {
  type: 'NEW_MESSAGE';
  payload: {
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
  };
}

type Event = NewMessageEvent;

export function useEvents() {
  const channels = useStore((state) => state.channels);
  const addMessageToChannel = useStore((state) => state.addMessageToChannel);

  const websocket = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (websocket.current) {
      websocket.current.onmessage = (e) => {
        const event = JSON.parse(e.data) as Event;

        if (event.type === 'NEW_MESSAGE') {
          const channel = channels.data?.find(
            (c) => c.id === event.payload.channel.id
          );
          if (channel) {
            addMessageToChannel(channel, {
              ...event.payload.message,
              created_at: new Date(event.payload.message.created_at),
            });
          }
        }
      };
    }
  }, [channels, addMessageToChannel, websocket]);

  useEffect(() => {
    (async function connectWebSocket() {
      if (websocket.current) return;

      const accessTokenRequest = await axios.get('/api/events/access-token');
      const accessToken = accessTokenRequest.data.access_token;
      websocket.current = new WebSocket(
        `ws://${location.host}/events?access_token=${accessToken}`
      );

      return () => {
        websocket.current?.close();
        websocket.current = null;
      };
    })();
  }, []);
}

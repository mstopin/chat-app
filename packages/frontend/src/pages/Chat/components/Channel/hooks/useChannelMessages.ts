import { useEffect } from 'react';

import { useStore } from '../../../../../store';
import { Channel } from '../../../../../types';

export default function useChannelMessages(channel: Channel) {
  const messages = useStore((state) => state.messages[channel.id]);
  const fetchMessagesForChannel = useStore(
    (state) => state.fetchMessagesForChannel
  );

  useEffect(() => {
    if (!messages) {
      fetchMessagesForChannel(channel);
    }
  }, [messages, fetchMessagesForChannel]);

  return {
    data: messages?.data ?? null,
    error: messages?.error ?? null,
    isLoading: messages?.isLoading ?? false,
  };
}

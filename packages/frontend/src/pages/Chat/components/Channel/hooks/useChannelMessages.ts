import { useEffect, useMemo } from 'react';

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

  return useMemo(
    () => ({
      data: messages?.data ?? null,
      error: messages?.error ?? null,
      isLoading: messages?.isLoading ?? false,
    }),
    [messages]
  );
}

import { useState } from 'react';
import axios from 'axios';

import { Channel, Message } from '../../../../../types';
import { useStore } from '../../../../../store';

export default function useSendMessage(channel: Channel) {
  const [isSending, setSending] = useState<boolean>(false);
  const addMessageToChannel = useStore((state) => state.addMessageToChannel);

  const sendMessage = async (content: string) => {
    try {
      setSending(true);
      const message = (
        await axios.post(`/api/channels/${channel.id}/messages`, {
          content,
        })
      ).data as Message;
      setSending(false);
      addMessageToChannel(channel, message);
    } catch {
      setSending(false);
    }
  };

  return {
    isSending,
    sendMessage,
  };
}

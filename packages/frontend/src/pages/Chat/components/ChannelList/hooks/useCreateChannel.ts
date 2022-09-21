import { useState } from 'react';
import axios from 'axios';

import { Channel } from '../../../../../types';
import { useStore } from '../../../../../store';

export default function useCreateChannel() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const addChannel = useStore((state) => state.addChannel);

  const createChannel = async (name: string, password: string | null) => {
    try {
      setLoading(true);
      const channel = (
        await axios.post('/api/channels', {
          name,
          password,
        })
      ).data as Channel;
      setLoading(false);
      addChannel(channel);
    } catch {
      setLoading(false);
    }
  };

  return {
    isLoading,
    createChannel,
  };
}

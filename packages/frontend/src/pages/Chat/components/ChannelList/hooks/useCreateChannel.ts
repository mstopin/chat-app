import { useState } from 'react';
import axios from 'axios';

import { Channel } from '../../../../../types';
import { useStore } from '../../../../../store';

export default function useCreateChannel() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
      setError(null);
      addChannel(channel);
    } catch (e: any) {
      setLoading(false);
      setError(e.response.data.message ?? 'Unknown error');
    }
  };

  const resetError = () => setError(null);

  return {
    isLoading,
    error,
    createChannel,
    resetError,
  };
}

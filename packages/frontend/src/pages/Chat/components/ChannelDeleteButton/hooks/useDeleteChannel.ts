import { useState } from 'react';
import axios from 'axios';

import { useStore } from '../../../../../store';
import { Channel } from '../../../../../types';

export default function useDeleteChannel() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const deleteChannelStore = useStore((state) => state.deleteChannel);

  const deleteChannel = async (channel: Channel) => {
    try {
      setLoading(true);
      await axios.delete(`/api/channels/${channel.id}`);
      setLoading(false);
      deleteChannelStore(channel);
    } catch {
      setLoading(false);
    }
  };

  return {
    isLoading,
    deleteChannel,
  };
}

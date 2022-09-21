import { useState } from 'react';
import axios from 'axios';

import { useUser } from '../../../../../hooks/useUser';
import { useStore } from '../../../../../store';
import { Channel } from '../../../../../types';

export default function useChannelMembership(channel: Channel) {
  const user = useUser().user!;

  const isOwnerOrMember =
    channel.owner.id === user.id ||
    !!channel.members.find((m) => m.id === user.id);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const joinChannelStore = useStore((state) => state.joinChannel);
  const leaveChannelStore = useStore((state) => state.leaveChannel);

  const joinChannel = async (password: string | null) => {
    try {
      setLoading(true);
      await axios.post(`/api/channels/${channel.id}/join`, {
        password,
      });
      setLoading(false);
      setError(null);
      joinChannelStore(channel, user);
    } catch (e: any) {
      setLoading(false);
      setError(e.response.data.message ?? 'Unknown error');
    }
  };

  const leaveChannel = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/channels/${channel.id}/leave`);
      setLoading(false);
      leaveChannelStore(channel, user);
    } catch {
      setLoading(false);
    }
  };

  return {
    isLoading,
    error,
    canJoin: !isOwnerOrMember,
    canLeave: isOwnerOrMember,
    joinChannel,
    leaveChannel,
  };
}

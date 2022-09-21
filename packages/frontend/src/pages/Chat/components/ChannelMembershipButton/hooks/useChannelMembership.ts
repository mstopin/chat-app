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
  const joinChannelStore = useStore((state) => state.joinChannel);
  const leaveChannelStore = useStore((state) => state.leaveChannel);

  const joinChannel = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/channels/${channel.id}/join`);
      setLoading(false);
      joinChannelStore(channel, user);
    } catch {
      setLoading(false);
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
    joinChannel: !isOwnerOrMember ? joinChannel : null,
    leaveChannel: isOwnerOrMember ? leaveChannel : null,
  };
}

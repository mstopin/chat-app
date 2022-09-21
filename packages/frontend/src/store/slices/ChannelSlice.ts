import { StateCreator } from 'zustand';
import axios from 'axios';

import { Channel, User } from '../../types';

export interface ChannelSlice {
  channels: {
    data: Channel[] | null;
    error: string | null;
    isLoading: boolean;
  };
  fetchChannels: () => Promise<void>;
  joinChannel: (channel: Channel, user: User) => void;
  leaveChannel: (channel: Channel, user: User) => void;
}

export const createChannelSlice: StateCreator<
  ChannelSlice,
  [],
  [],
  ChannelSlice
> = (set, get) => ({
  channels: {
    data: null,
    error: null,
    isLoading: false,
  },
  fetchChannels: async () => {
    try {
      set({ channels: { data: null, error: null, isLoading: true } });
      const response = await axios.get('/api/channels');
      const data = response.data as Channel[];
      set({ channels: { data, error: null, isLoading: false } });
    } catch (e: any) {
      set({ channels: { data: null, error: e.message, isLoading: false } });
    }
  },
  joinChannel: (channel: Channel, user: User) => {
    const channels = get().channels.data ?? [];
    const updatedChannels = channels.map((c) => {
      if (c.id !== channel.id) return c;
      return {
        ...channel,
        members: [...channel.members, user],
      };
    });
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
  leaveChannel: (channel: Channel, user: User) => {
    const channels = get().channels.data ?? [];
    const updatedChannels = channels.map((c) => {
      if (c.id !== channel.id) return c;
      return {
        ...channel,
        members: channel.members.filter((m) => m.id !== user.id),
      } as Channel;
    });
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
});

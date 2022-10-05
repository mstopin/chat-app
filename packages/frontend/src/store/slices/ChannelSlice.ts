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
  addChannel: (channel: Channel) => void;
  deleteChannel: (channel: Channel) => void;
  joinChannel: (channel: Channel, user: User) => void;
  leaveChannel: (channel: Channel, user: User) => void;
  markChannelAsDeleted: (channel: Channel) => void;
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
      const [channelsResponse, deletedChannelsResponse] = await Promise.all([
        axios.get('/api/channels'),
        axios.get('/api/channels/deleted'),
      ]);
      const channels = channelsResponse.data as Channel[];
      const deletedChannels = deletedChannelsResponse.data as Channel[];
      const data = [
        ...channels,
        ...deletedChannels.map((c) => ({
          ...c,
          deleted: true,
        })),
      ];
      set({ channels: { data, error: null, isLoading: false } });
    } catch (e: any) {
      set({ channels: { data: null, error: e.message, isLoading: false } });
    }
  },
  addChannel: (channel: Channel) => {
    if (!get().channels.data) return;
    const channels = get().channels.data!;
    const updatedChannels = [...channels, channel];
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
  deleteChannel: (channel: Channel) => {
    if (!get().channels.data) return;
    const channels = get().channels.data!;
    const updatedChannels = channels.filter((c) => c.id !== channel.id);
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
  joinChannel: (channel: Channel, user: User) => {
    if (!get().channels.data) return;
    const channels = get().channels.data!;
    const updatedChannels = channels.map((c) => {
      if (c.id !== channel.id) return c;
      return {
        ...c,
        members: [...channel.members, user],
      };
    });
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
  leaveChannel: (channel: Channel, user: User) => {
    if (!get().channels.data) return;
    const channels = get().channels.data!;
    const updatedChannels = channels.map((c) => {
      if (c.id !== channel.id) return c;
      return {
        ...c,
        members: channel.members.filter((m) => m.id !== user.id),
      } as Channel;
    });
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
  markChannelAsDeleted: (channel: Channel) => {
    if (!get().channels.data) return;
    const channels = get().channels.data!;
    const updatedChannels = channels.map((c) => {
      if (c.id !== channel.id) return c;
      return {
        ...c,
        deleted: true,
      };
    });
    set({ channels: { ...get().channels, data: updatedChannels } });
  },
});

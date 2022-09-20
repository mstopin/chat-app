import { StateCreator } from 'zustand';
import axios from 'axios';

import { Channel } from '../../types';

export interface ChannelSlice {
  channels: {
    data: Channel[] | null;
    error: string | null;
    isLoading: boolean;
  };
  fetchChannels: () => Promise<void>;
}

export const createChannelSlice: StateCreator<
  ChannelSlice,
  [],
  [],
  ChannelSlice
> = (set) => ({
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
});

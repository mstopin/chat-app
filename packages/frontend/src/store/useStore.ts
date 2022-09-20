import create from 'zustand';

import { createChannelSlice, ChannelSlice } from './slices/ChannelSlice';

export const useStore = create<ChannelSlice>()((...a) => ({
  ...createChannelSlice(...a),
}));

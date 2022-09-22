import create from 'zustand';

import { createChannelSlice, ChannelSlice } from './slices/ChannelSlice';
import { createMessageSlice, MessageSlice } from './slices/MessageSlice';

export const useStore = create<ChannelSlice & MessageSlice>()((...a) => ({
  ...createChannelSlice(...a),
  ...createMessageSlice(...a),
}));

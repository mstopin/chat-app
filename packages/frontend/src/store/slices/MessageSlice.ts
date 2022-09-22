import axios from 'axios';
import { StateCreator } from 'zustand';

import { Channel, Message } from '../../types';

type ChannelMessages = Record<
  Channel['id'],
  | {
      data: Message[] | null;
      error: string | null;
      isLoading: boolean;
    }
  | undefined
>;

export interface MessageSlice {
  messages: ChannelMessages;
  fetchMessagesForChannel: (channel: Channel) => Promise<void>;
  addMessageToChannel: (channel: Channel, message: Message) => void;
}

export const createMessageSlice: StateCreator<
  MessageSlice,
  [],
  [],
  MessageSlice
> = (set, get) => ({
  messages: {},
  fetchMessagesForChannel: async (channel: Channel) => {
    const createNewMessagesObject = (
      d: Message[] | null,
      e: string | null,
      iL: boolean
    ) => ({
      ...get().messages,
      [channel.id]: {
        data: d,
        error: e,
        isLoading: iL,
      },
    });
    set({ messages: createNewMessagesObject(null, null, true) });
    try {
      const messages = (await axios.get(`/api/channels/${channel.id}/messages`))
        .data as Message[];
      const formattedMessages = messages.map((m) => ({
        ...m,
        created_at: new Date(m.created_at),
      }));
      set({
        messages: createNewMessagesObject(formattedMessages, null, false),
      });
    } catch (e: any) {
      set({ messages: createNewMessagesObject(null, e.message, false) });
    }
  },
  addMessageToChannel: (channel: Channel, message: Message) => {
    if (!get().messages[channel.id]) return;
    set({
      messages: {
        ...get().messages,
        [channel.id]: {
          ...get().messages[channel.id]!,
          data: [...get().messages[channel.id]!.data!, message],
        },
      },
    });
  },
});

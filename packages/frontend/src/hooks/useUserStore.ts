import create from 'zustand';
import axios from 'axios';

import { User } from '../types/User';

interface UserStore {
  user: User | null;
  isLoading: boolean;
  isError: boolean;
  loadSessionUser: () => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  isError: false,
  loadSessionUser: async () => {
    try {
      set(() => ({ isLoading: true }));
      const response = await axios.get('/api/auth/me');
      set(() => ({ user: response.data, isError: false }));
    } catch {
      set(() => ({ isError: true }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  logIn: async (email: string, password: string) => {
    try {
      set(() => ({ isLoading: true }));
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });
      set(() => ({ user: response.data, isError: false }));
    } catch {
      set(() => ({ isError: true }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
}));

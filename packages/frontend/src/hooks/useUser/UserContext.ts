import { createContext } from 'react';
import { User } from '../../types';

export interface UserContextProps {
  user: User | null;
  setUser: (user: User) => void;
  logOut: () => Promise<void>;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

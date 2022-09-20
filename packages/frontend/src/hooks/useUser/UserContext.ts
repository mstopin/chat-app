import { createContext } from 'react';
import { User } from '../../types';

export interface UserContextProps {
  user: User | null;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);

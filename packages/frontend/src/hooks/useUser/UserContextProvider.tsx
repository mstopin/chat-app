import { useState, useCallback, PropsWithChildren } from 'react';
import axios from 'axios';

import { User } from '../../types';

import { UserContext, UserContextProps } from './UserContext';

export default function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const logOut = useCallback(async () => {
    if (!user) return;
    await axios.post('/api/auth/logout');
    setUser(null);
  }, [user]);

  const contextValue: UserContextProps = {
    user,
    setUser,
    logOut,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

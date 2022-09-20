import { useState, PropsWithChildren } from 'react';

import { User } from '../../types';

import { UserContext, UserContextProps } from './UserContext';

export default function UserContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const contextValue: UserContextProps = {
    user,
    setUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

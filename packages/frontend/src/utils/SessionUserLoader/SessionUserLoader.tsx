import { useEffect, PropsWithChildren } from 'react';
import shallow from 'zustand/shallow';

import { useUserStore } from '../../hooks/useUserStore';

export default function SessionUserLoader({ children }: PropsWithChildren) {
  const [user, isLoading, isError, loadSessionUser] = useUserStore(
    (state) => [
      state.user,
      state.isLoading,
      state.isError,
      state.loadSessionUser,
    ],
    shallow
  );

  useEffect(() => {
    if (!user && !isLoading && !isError) {
      loadSessionUser();
    }
  }, [user, isLoading, isError]);

  if (!isLoading && !user && !isError) {
    return null;
  }

  if (isLoading && !user && !isError) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}

import { useState, useEffect, PropsWithChildren } from 'react';
import axios from 'axios';

import { User } from '../../types';
import { useUser } from '../../hooks/useUser';
import { FullPageLoader } from '../../components/FullPageLoader';

export default function SessionUserLoader({ children }: PropsWithChildren) {
  const { user, setUser } = useUser();
  const [loadedUser, setLoadedUser] = useState<boolean>(!!user);

  useEffect(() => {
    if (loadedUser) return;
    (async function loadSessionUser() {
      try {
        const [response] = await Promise.all([
          await axios.get('/api/auth/me'),
          await new Promise((r) => setTimeout(r, 750)),
        ]);
        setUser(response.data as User);
        setLoadedUser(true);
      } catch {
        setLoadedUser(true);
      }
    })();
  }, []);

  if (!loadedUser) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

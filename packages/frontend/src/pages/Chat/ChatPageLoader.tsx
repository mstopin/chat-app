import { Suspense, lazy } from 'react';

import { FullPageLoader } from '../../components/FullPageLoader';

const ChatPage = lazy(() => import('./Chat'));

export default function ChatPageLoader() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ChatPage />
    </Suspense>
  );
}

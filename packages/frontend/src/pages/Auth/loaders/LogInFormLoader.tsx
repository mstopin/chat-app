import { Suspense, lazy } from 'react';

import { FullPageLoader } from '../../../components/FullPageLoader';

const LogInForm = lazy(() => import('../forms/LogInForm'));

export default function LogInFormLoader() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <LogInForm />
    </Suspense>
  );
}

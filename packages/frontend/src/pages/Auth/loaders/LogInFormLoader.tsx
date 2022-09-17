import { Suspense, lazy } from 'react';

import Fallback from './Fallback';

const LogInForm = lazy(() => import('../forms/LogInForm'));

export default function LogInFormLoader() {
  return (
    <Suspense fallback={<Fallback />}>
      <LogInForm />
    </Suspense>
  );
}

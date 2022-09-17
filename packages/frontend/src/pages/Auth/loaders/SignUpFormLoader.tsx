import { Suspense, lazy } from 'react';

import Fallback from './Fallback';

const SignUpForm = lazy(() => import('../forms/SignUpForm'));

export default function SignUpFormLoader() {
  return (
    <Suspense fallback={<Fallback />}>
      <SignUpForm />
    </Suspense>
  );
}

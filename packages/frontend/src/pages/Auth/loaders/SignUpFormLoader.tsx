import { Suspense, lazy } from 'react';

import { FullPageLoader } from '../../../components/FullPageLoader';

const SignUpForm = lazy(() => import('../forms/SignUpForm'));

export default function SignUpFormLoader() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <SignUpForm />
    </Suspense>
  );
}

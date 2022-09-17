import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from 'react-router-dom';

import { RootPage } from '../pages/Root';
import { AuthPage, LogInAuthPage, SignUpAuthPage } from '../pages/Auth';
import { ChatPage } from '../pages/Chat';

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<RootPage />} />
    <Route path="/auth" element={<AuthPage />}>
      <Route path="/auth/login" element={<LogInAuthPage />} />
      <Route path="/auth/signup" element={<SignUpAuthPage />} />
    </Route>
    <Route path="/chat" element={<ChatPage />} />
  </>
);

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}

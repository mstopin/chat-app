import {
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Route,
} from 'react-router-dom';

const routes = createRoutesFromElements(<Route path="/" element={<div />} />);

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}

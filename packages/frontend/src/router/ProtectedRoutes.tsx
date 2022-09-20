import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

import { useUser } from '../hooks/useUser';

export default function ProtectedRoutes() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return user ? (
    <>
      <Outlet />
    </>
  ) : null;
}

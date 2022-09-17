import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Container, Center } from '@chakra-ui/react';

import { useUserStore } from '../../hooks/useUserStore';

export default function Auth() {
  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth') {
      navigate('/auth/login');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user]);

  return (
    <Container size="sm">
      <Center h="100vh">
        <Outlet />
      </Center>
    </Container>
  );
}

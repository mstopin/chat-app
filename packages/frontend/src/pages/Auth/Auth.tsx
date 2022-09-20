import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Container, Center } from '@chakra-ui/react';

import { useUser } from '../../hooks/useUser';

export default function Auth() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
  }, [user, navigate]);

  return (
    <Container size="sm">
      <Center h="100vh">
        <Outlet />
      </Center>
    </Container>
  );
}

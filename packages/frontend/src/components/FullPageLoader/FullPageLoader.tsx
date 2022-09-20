import { Center } from '@chakra-ui/react';
import { PuffLoader } from 'react-spinners';

export default function FullPageLoader() {
  return (
    <Center w="100vw" h="100vh">
      <PuffLoader size={100} color="#2F80ED" />;
    </Center>
  );
}

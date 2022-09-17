import { Center } from '@chakra-ui/react';
import { PuffLoader } from 'react-spinners';

export default function Fallback() {
  return (
    <Center>
      <PuffLoader size={80} color="#2F80ED" />;
    </Center>
  );
}

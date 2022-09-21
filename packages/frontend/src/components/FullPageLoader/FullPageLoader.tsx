import { Center } from '@chakra-ui/react';

import { Loader } from '../Loader';

export default function FullPageLoader() {
  return (
    <Center w="100vw" h="100vh">
      <Loader size={100} />
    </Center>
  );
}

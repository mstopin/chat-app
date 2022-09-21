import { Flex, Box, Center } from '@chakra-ui/react';

import { Loader } from '../../../../components/Loader';

import { useFilteredChannels } from './hooks/useFilteredChannels';

import { ChannelListFilterSelector } from '../ChannelListFilterSelector';
import { Channel } from '../Channel';

export default function ChannelList() {
  const { channels, isLoading, filter, setFilter } = useFilteredChannels();

  return (
    <Flex w="100%" h="100%">
      <Box flex="1" borderRight="1px solid #BDBDBD">
        {isLoading && (
          <Center h="100%">
            <Loader size={80} />
          </Center>
        )}
        {!isLoading && (
          <>
            <ChannelListFilterSelector
              filter={filter}
              onFilterChange={setFilter}
            />
            <Box p={2}>
              {channels.map((c) => (
                <Channel channel={c} key={c.id} />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Flex>
  );
}

import { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { useStore } from '../../../../store';
import { useUser } from '../../../../hooks/useUser';

import ChannelFilter from './ChannelFilter';
import ChannelFilterSelector from './ChannelFilterSelector';
import Channel from './Channel';

export default function ChannelsList() {
  const { user } = useUser();
  const channels = useStore((state) => state.channels);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>(
    ChannelFilter.MY_CHANNELS
  );

  const filteredChannels =
    channelFilter === ChannelFilter.ALL_CHANNELS
      ? channels.data ?? []
      : (channels.data ?? []).filter((c) => c.owner.id === user!.id);

  return (
    <Flex w="100%" h="100%">
      <Box flex="1" borderRight="1px solid #BDBDBD">
        <ChannelFilterSelector
          filter={channelFilter}
          onFilterChange={setChannelFilter}
        />
        <Box p={2}>
          {filteredChannels.map((c) => (
            <Channel
              channel={c}
              isOwnedByUser={c.owner.id === user!.id}
              key={c.id}
            />
          ))}
        </Box>
      </Box>
    </Flex>
  );
}

import { useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { Channel as ChannelType } from '../../../../types';
import { useStore } from '../../../../store';
import { useUser } from '../../../../hooks/useUser';

import ChannelFilter from './ChannelFilter';
import ChannelFilterSelector from './ChannelFilterSelector';
import Channel from './Channel';

export default function ChannelsList() {
  const { user } = useUser();
  const channels = useStore((state) => state.channels);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>(
    ChannelFilter.JOINED_CHANNELS
  );

  const createFilterStrategy = () => {
    if (channelFilter === ChannelFilter.JOINED_CHANNELS) {
      return (c: ChannelType) =>
        c.owner.id === user!.id || !!c.members.find((m) => m.id === user!.id);
    }
    return (c: ChannelType) =>
      c.owner.id !== user!.id && !c.members.find((m) => m.id === user!.id);
  };
  const filteredChannels = (channels.data ?? []).filter(createFilterStrategy());

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

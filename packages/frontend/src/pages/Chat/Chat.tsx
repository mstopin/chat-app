import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Flex, Box } from '@chakra-ui/react';

import { useStore } from '../../store';

import { ChannelList } from './components/ChannelList';
import { Channel } from './components/Channel';
import { useEvents } from './hooks/useEvents';

export default function Chat() {
  useEvents();
  const channels = useStore((state) => state.channels);
  const fetchChannels = useStore((state) => state.fetchChannels);

  const { channelId: paramChannelId } = useParams();
  const selectedChannel = channels.data
    ? channels.data.find((c) => c.id === paramChannelId)
    : null;

  useEffect(() => {
    if (!channels.data && !channels.error && !channels.isLoading) {
      fetchChannels();
    }
  }, [channels]);

  return (
    <Flex h="100vh">
      <Box flex="0 1 350px">
        <ChannelList />
      </Box>
      <Box flex="1 0 0">
        {selectedChannel && <Channel channel={selectedChannel} />}
      </Box>
    </Flex>
  );
}

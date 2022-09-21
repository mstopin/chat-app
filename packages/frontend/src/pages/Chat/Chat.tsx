import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';

import { useStore } from '../../store';

import { ChannelList } from './components/ChannelList';

export default function Chat() {
  const channels = useStore((state) => state.channels);
  const fetchChannels = useStore((state) => state.fetchChannels);

  useEffect(() => {
    if (!channels.data && !channels.error && !channels.isLoading) {
      fetchChannels();
    }
  }, [channels]);

  return (
    <Grid h="100vh" templateColumns="1fr 2.5fr">
      <GridItem>
        <ChannelList />
      </GridItem>
      <GridItem>
        <Outlet />
      </GridItem>
    </Grid>
  );
}

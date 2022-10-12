import { useState } from 'react';
import { Flex, Box, Center, Button } from '@chakra-ui/react';

import { Loader } from '../../../../components/Loader';
import { useUser } from '../../../../hooks/useUser';

import { ChannelFilter } from '../../types';
import { ChannelListItem } from '../ChannelListItem';

import ChannelFilterSelector from './ChannelTypeFilterSelector';
import CreateChannelModal from './modals/CreateChannelModal';
import useFilteredChannels from './hooks/useFilteredChannels';
import useCreateChannel from './hooks/useCreateChannel';

export default function ChannelList() {
  const { logOut } = useUser();
  const { channels, isLoading, filter, setFilter } = useFilteredChannels();
  const {
    isLoading: isCreatingChannel,
    error: createChannelError,
    resetError: resetChannelError,
    createChannel,
  } = useCreateChannel();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <Flex w="100%" h="100%">
      <Box flexGrow="1" borderRight="1px solid #BDBDBD">
        {isLoading && (
          <Center h="100%">
            <Loader size={80} />
          </Center>
        )}
        {!isLoading && (
          <>
            <Flex h="100%" direction="column">
              <ChannelFilterSelector
                filter={filter}
                onFilterChange={setFilter}
              />
              <Box p={2} flex="1 0 0" overflowY="auto">
                {channels.map((c) => (
                  <ChannelListItem
                    channel={c}
                    isSelectable={filter === ChannelFilter.JOINED_CHANNELS}
                    key={c.id}
                  />
                ))}
              </Box>
              <Box p={2} borderTop="1px solid #BDBDBD">
                <Flex justifyContent="space-between">
                  <Button
                    color="white"
                    bg="#2F80ED"
                    sx={{ '&:hover': { bg: '#1369DE !important' } }}
                    onClick={() => setModalOpen(true)}
                  >
                    Create channel
                  </Button>
                  <Button onClick={logOut}>Log out</Button>
                </Flex>
              </Box>
            </Flex>
            <CreateChannelModal
              isOpen={isModalOpen}
              isLoading={isCreatingChannel}
              error={createChannelError}
              createChannel={createChannel}
              onClose={() => {
                resetChannelError();
                setModalOpen(false);
              }}
            />
          </>
        )}
      </Box>
    </Flex>
  );
}

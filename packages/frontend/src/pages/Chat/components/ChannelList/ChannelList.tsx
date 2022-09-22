import { useState } from 'react';
import { Flex, Box, Center, Button } from '@chakra-ui/react';

import { Loader } from '../../../../components/Loader';

import { ChannelFilter } from '../../types';
import { ChannelListFilterSelector } from '../ChannelListFilterSelector';
import { Channel } from '../Channel';

import useFilteredChannels from './hooks/useFilteredChannels';
import useCreateChannel from './hooks/useCreateChannel';
import CreateChannelModal from './modals/CreateChannelModal';

export default function ChannelList() {
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
              <ChannelListFilterSelector
                filter={filter}
                onFilterChange={setFilter}
              />
              <Box p={2} flex="1 0 0" overflowY="auto">
                {channels.map((c) => (
                  <Channel
                    channel={c}
                    isSelectable={filter === ChannelFilter.JOINED_CHANNELS}
                    key={c.id}
                  />
                ))}
              </Box>
              <Box p={2} borderTop="1px solid #BDBDBD">
                <Flex justifyContent="start">
                  <Button
                    color="white"
                    bg="#2F80ED"
                    sx={{ '&:hover': { bg: '#1369DE !important' } }}
                    onClick={() => setModalOpen(true)}
                  >
                    Create channel
                  </Button>
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

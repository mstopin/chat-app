import { Box, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { Channel as ChannelType } from '../../../../types';

interface ChannelProps {
  channel: ChannelType;
}

export default function Channel({ channel }: ChannelProps) {
  const { channelId: paramChannelId } = useParams();

  const memberCount = channel.members.length + 1; // members + owner
  const isSelected = channel.id === paramChannelId;

  return (
    <Link to={`/chat/${channel.id}`} style={{ display: 'block' }}>
      <Box
        bg={isSelected ? '#EEEEEE' : 'white'}
        sx={{ '&:hover': { bg: '#EEEEEE' } }}
        transition="ease-in-out 0.2s"
        borderRadius="lg"
      >
        <Box py={2} px={2}>
          <Flex alignItems="center">
            <Text fontWeight="bold">{channel.name}</Text>
            {channel.hasPassword && (
              <Text ml={2} fontSize="sm">
                <FaLock />
              </Text>
            )}
          </Flex>
          <Text fontSize="sm">
            Owner: {channel.owner.name}&nbsp;{channel.owner.surname}
          </Text>
          <Text fontSize="sm">Members: {memberCount}</Text>
        </Box>
      </Box>
    </Link>
  );
}

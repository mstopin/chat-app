import { Box, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { Channel as ChannelType } from '../../../../types';

interface ChannelProps {
  channel: ChannelType;
  isOwnedByUser: boolean;
}

export default function Channel({ channel, isOwnedByUser }: ChannelProps) {
  const { channelId: paramChannelId } = useParams();

  const isSelected = channel.id === paramChannelId;
  const memberCount = channel.members.length + 1; // members + owner
  const ownerText = isOwnedByUser
    ? 'You'
    : `${channel.owner.name} ${channel.owner.surname}`;

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
          <Text fontSize="sm">Owner: {ownerText}</Text>
          <Text fontSize="sm">Members: {memberCount}</Text>
        </Box>
      </Box>
    </Link>
  );
}

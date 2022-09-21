import { Box, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { useUser } from '../../../../hooks/useUser';

import { Channel as ChannelType } from '../../../../types';

import { ChannelMembershipButton } from '../ChannelMembershipButton';

interface ChannelProps {
  channel: ChannelType;
}

export default function Channel({ channel }: ChannelProps) {
  const { channelId: paramChannelId } = useParams();
  const user = useUser().user!;

  const isSelected = paramChannelId === channel.id;

  const numberMembers = channel.members.length + 1;
  const ownerText =
    channel.owner.id === user.id
      ? 'You'
      : `${channel.owner.name} ${channel.owner.surname}`;

  return (
    <Link to={`/chat/${channel.id}`} style={{ display: 'block' }}>
      <Box
        bg={isSelected ? '#EEEEEE' : 'white'}
        sx={{ '&:hover': { bg: '#EEEEEE' } }}
        transition="ease-in-out 0.2s"
        borderRadius="lg"
        position="relative"
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
          <Text fontSize="sm">Members: {numberMembers}</Text>
        </Box>
        <ChannelMembershipButton channel={channel} />
      </Box>
    </Link>
  );
}

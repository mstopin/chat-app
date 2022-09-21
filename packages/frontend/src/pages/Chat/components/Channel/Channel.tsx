import { chakra, Box, Text } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { useUser } from '../../../../hooks/useUser';

import { Channel as ChannelType } from '../../../../types';

import { ChannelMembershipButton } from '../ChannelMembershipButton';
import { ChannelDeleteButton } from '../ChannelDeleteButton';

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
        <Box py={2} pl={2} pr="64px">
          <Text fontWeight="bold">
            {channel.name}
            {channel.hasPassword && (
              <chakra.span ml={2} sx={{ '& > *': { display: 'inline' } }}>
                <FaLock />
              </chakra.span>
            )}
          </Text>
          <Text fontSize="sm">Owner: {ownerText}</Text>
          <Text fontSize="sm">Members: {numberMembers}</Text>
        </Box>
        {channel.owner.id !== user.id && (
          <ChannelMembershipButton channel={channel} />
        )}
        {channel.owner.id === user.id && (
          <ChannelDeleteButton channel={channel} />
        )}
      </Box>
    </Link>
  );
}

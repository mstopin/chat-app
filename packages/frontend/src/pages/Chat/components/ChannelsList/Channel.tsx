import { Box, Text, Flex } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { Channel as ChannelType, User } from '../../../../types';

import ChannelMemberShipButton from './ChannelMembershipButton';

interface ChannelProps {
  channel: ChannelType;
  user: User;
}

export default function Channel({ channel, user }: ChannelProps) {
  const { channelId: paramChannelId } = useParams();

  const isSelected = channel.id === paramChannelId;
  const isOwner = channel.owner.id === user.id;
  const isMember = !!channel.members.find((m) => m.id === user.id);

  const memberCount = channel.members.length + 1; // members + owner
  const ownerText = isOwner
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
          <Text fontSize="sm">Members: {memberCount}</Text>
        </Box>
        <ChannelMemberShipButton isMember={isOwner || isMember} />
      </Box>
    </Link>
  );
}

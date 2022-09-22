import { chakra, Box, Text } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

import { useUser } from '../../../../hooks/useUser';
import { Channel as ChannelType } from '../../../../types';

import ManageMembershipButton from './ManageMembershipButton';
import DeleteChannelButton from './DeleteChannelButton';

interface ChannelListItemProps {
  channel: ChannelType;
  isSelectable: boolean;
}

export default function ChannelListItem({
  channel,
  isSelectable,
}: ChannelListItemProps) {
  const { channelId: paramChannelId } = useParams();
  const user = useUser().user!;

  const isSelected = paramChannelId === channel.id;

  const numberMembers = channel.members.length + 1;
  const ownerText =
    channel.owner.id === user.id
      ? 'You'
      : `${channel.owner.name} ${channel.owner.surname}`;

  const renderContent = () => (
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
        <ManageMembershipButton channel={channel} />
      )}
      {channel.owner.id === user.id && (
        <DeleteChannelButton channel={channel} />
      )}
    </Box>
  );

  if (!isSelectable) {
    return <Box>{renderContent()}</Box>;
  }

  return (
    <Link
      to={isSelectable ? `/chat/${channel.id}` : ''}
      style={{ display: 'block' }}
    >
      {renderContent()}
    </Link>
  );
}

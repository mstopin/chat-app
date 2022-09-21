import { chakra, Box, Text } from '@chakra-ui/react';
import { IoEnter, IoExit } from 'react-icons/io5';

interface ChannelMembershipButtonProps {
  isMember: boolean;
}

export default function ChannelMembershipButton({
  isMember,
}: ChannelMembershipButtonProps) {
  const label = isMember ? 'Leave channel' : 'Join channel';

  return (
    <Box
      position="absolute"
      top="50%"
      right={1}
      transform="translate(-50%, -50%)"
    >
      <chakra.button
        display="block"
        backgroundColor="white"
        padding={2}
        borderRadius="2xl"
        boxShadow="0 0 0 1px #BDBDBD"
        sx={{
          '&:hover': {
            bg: '#F8F8F8',
          },
        }}
        title={label}
        aria-label={label}
        onClick={(e) => {
          e.preventDefault();
        }}
      >
        <Text fontSize="xl">
          {isMember && <IoExit />}
          {!isMember && <IoEnter />}
        </Text>
      </chakra.button>
    </Box>
  );
}

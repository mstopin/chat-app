import { Flex, Box, Button, Text } from '@chakra-ui/react';

import ChannelFilter from './ChannelFilter';

interface ChannelFilterSelectorProps {
  filter: ChannelFilter;
  onFilterChange: (filter: ChannelFilter) => void;
}

export default function ChannelFilterSelector({
  filter,
  onFilterChange,
}: ChannelFilterSelectorProps) {
  return (
    <Flex borderBottom="1px solid #BDBDBD">
      <Box flex="1">
        <ChannelTypeButton
          type="Channels"
          isSelected={filter === ChannelFilter.JOINED_CHANNELS}
          onClick={() => onFilterChange(ChannelFilter.JOINED_CHANNELS)}
        />
      </Box>
      <Box flex="1">
        <ChannelTypeButton
          type="Join channels"
          isSelected={filter === ChannelFilter.JOINABLE_CHANNELS}
          onClick={() => onFilterChange(ChannelFilter.JOINABLE_CHANNELS)}
        />
      </Box>
    </Flex>
  );
}

interface ChannelTypeButtonProps {
  type: string;
  isSelected: boolean;
  onClick: () => void;
}

function ChannelTypeButton(props: ChannelTypeButtonProps) {
  const { type, isSelected, onClick } = props;

  return (
    <Button
      width="100%"
      variant="unstyled"
      py={3}
      height="auto"
      onClick={onClick}
    >
      <Text
        color={isSelected ? 'gray.700' : 'gray.400'}
        sx={{ '&:hover': { color: 'gray.700' } }}
        transition="ease-in-out 0.1s"
      >
        {type}
      </Text>
    </Button>
  );
}

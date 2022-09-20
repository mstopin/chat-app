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
          type={ChannelFilter.MY_CHANNELS}
          isSelected={filter === ChannelFilter.MY_CHANNELS}
          onClick={() => onFilterChange(ChannelFilter.MY_CHANNELS)}
        />
      </Box>
      <Box flex="1">
        <ChannelTypeButton
          type={ChannelFilter.ALL_CHANNELS}
          isSelected={filter === ChannelFilter.ALL_CHANNELS}
          onClick={() => onFilterChange(ChannelFilter.ALL_CHANNELS)}
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

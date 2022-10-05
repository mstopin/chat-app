import { Box, Flex, Circle, Text, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';

interface MessageProps {
  sender: {
    name: string;
    surname: string;
  } | null;
  content: string;
  created_at: Date;
}

interface SenderInitialsCircleProps {
  name: string;
  surname: string;
}

function SenderInitialsCircle({ name, surname }: SenderInitialsCircleProps) {
  return (
    <Circle size="36px" mr={2} bg="#F2F2F2">
      <Text letterSpacing="0">
        {name[0]}
        {surname[0]}
      </Text>
    </Circle>
  );
}

export default function Message({ sender, content, created_at }: MessageProps) {
  const justifyContent = sender ? 'start' : 'end';
  const tooltipPlacement = sender ? 'right' : 'left';

  const formattedCreatedAt = dayjs(created_at).format('HH:mm');

  return (
    <Box mb={2} _last={{ mb: 0 }}>
      <Flex justifyContent={justifyContent}>
        <Tooltip label={formattedCreatedAt} placement={tooltipPlacement}>
          <Flex>
            {sender && (
              <SenderInitialsCircle
                name={sender.name}
                surname={sender.surname}
              />
            )}
            <Box py={1.5} px={3} bg="#F2F2F2" borderRadius="xl">
              {content}
            </Box>
          </Flex>
        </Tooltip>
      </Flex>
    </Box>
  );
}

import { Box, Flex, Circle, Text, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';

interface MessageProps {
  sender: {
    name: string;
    surname: string;
  };
  sentByCurrentUser: boolean;
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

export default function Message({
  sender,
  content,
  sentByCurrentUser,
  created_at,
}: MessageProps) {
  const contentPosition = sentByCurrentUser ? 'end' : 'start';
  const tooltipPlacement = sentByCurrentUser ? 'left' : 'right';
  const formattedCreatedAt = dayjs(created_at).format('HH:mm');

  return (
    <Box mb={3} _last={{ mb: 0 }}>
      <Flex justifyContent={contentPosition}>
        <Flex alignItems={contentPosition} direction="column">
          <Text fontSize="small" color="gray.500" mb={1}>
            {sender.name}&nbsp;{sender.surname}
          </Text>
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
      </Flex>
    </Box>
  );
}

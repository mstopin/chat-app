import { Box, Text } from '@chakra-ui/react';

import { useUser } from '../../../../hooks/useUser';
import { Message as MessageType } from '../../../../types';

import Message from './Message';
import { useDateDividedMessages } from './hooks/useDateDividedMessages';

interface MessageListProps {
  messages: MessageType[];
}

export default function MessageList({ messages }: MessageListProps) {
  const user = useUser().user!;
  const dateDividedMessages = useDateDividedMessages(messages);

  return (
    <Box p={2}>
      {dateDividedMessages.map((ddm) => (
        <Box key={ddm.date} mb={24} _last={{ mb: 0 }}>
          <Box mb={3}>
            <Text textAlign="center" color="gray.500">
              {ddm.date}
            </Text>
          </Box>
          <Box>
            {ddm.messages.map((m) => (
              <Message
                content={m.content}
                created_at={m.created_at}
                sender={m.sender.id !== user.id ? m.sender : null}
                key={m.id}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

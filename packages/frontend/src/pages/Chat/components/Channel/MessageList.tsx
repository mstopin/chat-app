import { Box } from '@chakra-ui/react';
import { useUser } from '../../../../hooks/useUser';

import { Message as MessageType } from '../../../../types';

import Message from './Message';

interface MessageListProps {
  messages: MessageType[];
}

export default function MessageList({ messages }: MessageListProps) {
  const user = useUser().user!;

  return (
    <Box p={2}>
      {messages.map((m) => (
        <Message
          content={m.content}
          sender={m.sender.id !== user.id ? m.sender : null}
          key={m.id}
        />
      ))}
    </Box>
  );
}

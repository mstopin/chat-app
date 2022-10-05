import { useState, useRef, useEffect } from 'react';
import { Flex, Box, Text, Input, Button } from '@chakra-ui/react';

import { Channel as ChannelType } from '../../../../types';

import useChannelMessages from './hooks/useChannelMessages';
import useSendMessage from './hooks/useSendMessage';
import MessageList from './MessageList';

interface ChannelProps {
  channel: ChannelType;
}

export default function Channel({ channel }: ChannelProps) {
  const messages = useChannelMessages(channel);
  const { sendMessage } = useSendMessage(channel);

  const [message, setMessage] = useState<string>('');

  const onSend = () => {
    if (!message.length) return;
    sendMessage(message).then(() => {
      setMessage('');
    });
  };

  const messageListEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageListEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  return (
    <Flex h="100%" direction="column">
      <Box borderBottom="1px solid #BDBDBD">
        <Box px={4} py={3}>
          <Text textAlign="center" fontWeight="bold">
            {channel.name}
          </Text>
        </Box>
      </Box>
      <Box flexGrow="1" overflowY="auto">
        {messages.data && <MessageList messages={messages.data} />}
        <div ref={messageListEndRef} />
      </Box>
      <Box borderTop="1px solid #BDBDBD">
        <Box p={2}>
          <Flex>
            <Input
              mr={4}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              flex="0 1 100px"
              color="white"
              bg="#2F80ED"
              sx={{ '&:hover': { bg: '#1369DE !important' } }}
              onClick={onSend}
            >
              Send
            </Button>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

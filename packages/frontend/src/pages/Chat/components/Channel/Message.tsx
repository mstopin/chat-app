import { Box, Flex, Circle, Text } from '@chakra-ui/react';

interface MessageProps {
  sender: {
    name: string;
    surname: string;
  } | null;
  content: string;
}

export default function Message({ sender, content }: MessageProps) {
  const justifyContent = sender ? 'start' : 'end';

  return (
    <Flex justifyContent={justifyContent} mb={2} _last={{ mb: 0 }}>
      {sender && (
        <Circle
          size="36px"
          mr={2}
          bg="#F2F2F2"
          title={`${sender.name} ${sender.surname}`}
        >
          <Text letterSpacing="0">
            {sender.name[0]}
            {sender.surname[0]}
          </Text>
        </Circle>
      )}
      <Box py={1.5} px={3} bg="#F2F2F2" borderRadius="xl">
        {content}
      </Box>
    </Flex>
  );
}

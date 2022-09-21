import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';

interface JoinChannelWithPasswordModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  joinChannel: (password: string | null) => Promise<void>;
  onClose: () => void;
}

export default function JoinChannelWithPasswordModal({
  isOpen,
  isLoading,
  error,
  joinChannel,
  onClose,
}: JoinChannelWithPasswordModalProps) {
  const [password, setPassword] = useState<string>('');

  const onCloseNoop = () => undefined;

  return (
    <Modal isOpen={isOpen} onClose={isLoading ? onCloseNoop : onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Join channel</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Channel password:</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          {!!error && (
            <Text mt={2} color="red.500" fontWeight="bold">
              {error}
            </Text>
          )}
        </ModalBody>
        <ModalFooter display="block">
          <Flex justifyContent="end">
            <Button display="block" flex="0 1 100px" mr={4} onClick={onClose}>
              Cancel
            </Button>
            <Button
              display="block"
              flex="0 1 100px"
              color="white"
              bg="#2F80ED"
              sx={{
                '&:hover': {
                  bg: '#1369DE !important',
                },
                '& > div': {
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                },
              }}
              isLoading={isLoading}
              onClick={() => {
                joinChannel(password);
              }}
            >
              Join
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

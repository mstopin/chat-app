import { useState } from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

import {
  Modal,
  ModalButton,
  ModalPrimaryButton,
  ModalButtonContainer,
} from '../../../../../components/Modal';

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
    <Modal
      title="Join channel"
      isOpen={isOpen}
      onClose={isLoading ? onCloseNoop : onClose}
      renderBody={() => (
        <>
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
        </>
      )}
      renderFooter={() => (
        <ModalButtonContainer>
          <ModalButton
            text="Cancel"
            onClick={isLoading ? onCloseNoop : onClose}
          />
          <ModalPrimaryButton
            text="Join"
            isLoading={isLoading}
            onClick={() => {
              joinChannel(password);
            }}
          />
        </ModalButtonContainer>
      )}
    />
  );
}

import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

interface ModalProps {
  title: string;
  isOpen: boolean;
  renderBody: () => React.ReactNode;
  renderFooter: () => React.ReactNode;
  onClose: () => void;
}

export default function Modal({
  title,
  renderBody,
  renderFooter,
  isOpen,
  onClose,
}: ModalProps) {
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{renderBody()}</ModalBody>
        <ModalFooter display="block">{renderFooter()}</ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}

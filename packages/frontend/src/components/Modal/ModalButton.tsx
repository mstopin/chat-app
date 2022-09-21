import { Flex, Button } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export function ModalButtonContainer({ children }: PropsWithChildren) {
  return (
    <Flex
      justifyContent="end"
      sx={{
        '& > button:not(:last-child)': {
          mr: 2,
        },
      }}
    >
      {children}
    </Flex>
  );
}

interface ModalButtonProps {
  text: string;
  onClick: () => void;
}

export function ModalButton({ text, onClick }: ModalButtonProps) {
  return (
    <Button display="block" flex="0 1 100px" onClick={onClick}>
      {text}
    </Button>
  );
}

type ModalPrimaryButtonProps = ModalButtonProps & {
  isLoading: boolean;
};

export function ModalPrimaryButton({
  text,
  isLoading,
  onClick,
}: ModalPrimaryButtonProps) {
  return (
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
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

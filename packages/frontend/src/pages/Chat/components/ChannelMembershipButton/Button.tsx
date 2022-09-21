import { MouseEvent } from 'react';
import { chakra, Box, Text, keyframes } from '@chakra-ui/react';
import { ImSpinner8 } from 'react-icons/im';

function LoadingIcon() {
  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(359deg); }
  `;

  return (
    <chakra.span animation={`${rotate} infinite .75s linear`}>
      <ImSpinner8 />
    </chakra.span>
  );
}

interface ButtonProps {
  icon: JSX.Element;
  label: string;
  isLoading: boolean;
  onClick: (e: MouseEvent) => void;
}

export default function Button({
  icon,
  label,
  isLoading,
  onClick,
}: ButtonProps) {
  return (
    <Box
      position="absolute"
      top="50%"
      right={1}
      transform="translate(-50%, -50%)"
    >
      <chakra.button
        display="block"
        backgroundColor="white"
        padding={2}
        borderRadius="2xl"
        boxShadow="0 0 0 1px #BDBDBD"
        sx={{
          '&:hover:not([disabled])': {
            bg: '#F8F8F8',
          },
          '&:disabled': {
            cursor: 'default',
          },
        }}
        title={label}
        aria-label={label}
        onClick={onClick}
        disabled={isLoading}
      >
        <Text fontSize="xl">
          {isLoading && <LoadingIcon />}
          {!isLoading && icon}
        </Text>
      </chakra.button>
    </Box>
  );
}

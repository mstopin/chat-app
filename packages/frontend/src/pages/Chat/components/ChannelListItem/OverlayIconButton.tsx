import { chakra, Box, keyframes } from '@chakra-ui/react';
import { ImSpinner8 } from 'react-icons/im';

interface OverlayIconButtonProps {
  icon: JSX.Element;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export function LoadingIcon() {
  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  return (
    <chakra.span animation={`${rotate} infinite .75s linear`} display="block">
      <ImSpinner8 />
    </chakra.span>
  );
}

export default function OverlayIconButton({
  icon,
  label,
  disabled,
  onClick,
}: OverlayIconButtonProps) {
  return (
    <Box
      position="absolute"
      top="50%"
      right="0"
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
        disabled={disabled}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {icon}
      </chakra.button>
    </Box>
  );
}

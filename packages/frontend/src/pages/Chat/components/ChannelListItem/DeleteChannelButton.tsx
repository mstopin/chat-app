import { FaTrash } from 'react-icons/fa';

import { Channel } from '../../../../types';

import OverlayIconButton, { LoadingIcon } from './OverlayIconButton';
import useDeleteChannel from './hooks/useDeleteChannel';

interface DeleteChannelButtonProps {
  channel: Channel;
}

export default function DeleteChannelButton({
  channel,
}: DeleteChannelButtonProps) {
  const { isLoading, deleteChannel } = useDeleteChannel();

  return (
    <OverlayIconButton
      icon={isLoading ? <LoadingIcon /> : <FaTrash />}
      label="Delete channel"
      disabled={isLoading}
      onClick={() => {
        deleteChannel(channel);
      }}
    />
  );
}

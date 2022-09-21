import { FaTrash } from 'react-icons/fa';

import { Channel } from '../../../../types';

import {
  ChannelOverlayIconButton,
  LoadingIcon,
} from '../ChannelOverlayIconButton';

import useDeleteChannel from './hooks/useDeleteChannel';

interface ChannelDeleteButtonProps {
  channel: Channel;
}

export default function ChannelDeleteButton({
  channel,
}: ChannelDeleteButtonProps) {
  const { isLoading, deleteChannel } = useDeleteChannel();

  return (
    <ChannelOverlayIconButton
      icon={isLoading ? <LoadingIcon /> : <FaTrash />}
      label="Delete channel"
      disabled={isLoading}
      onClick={() => {
        deleteChannel(channel);
      }}
    />
  );
}

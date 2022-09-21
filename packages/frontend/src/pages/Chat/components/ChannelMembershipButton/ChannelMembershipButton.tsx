import { useState } from 'react';
import { ImEnter, ImExit } from 'react-icons/im';

import { Channel } from '../../../../types';

import {
  ChannelOverlayIconButton,
  LoadingIcon,
} from '../ChannelOverlayIconButton';

import useChannelMembership from './hooks/useChannelMembership';
import JoinChannelWithPasswordModal from './modals/JoinChannelWithPasswordModal';

interface ChannelMembershipButtonProps {
  channel: Channel;
}

export default function ChannelMembershipButton({
  channel,
}: ChannelMembershipButtonProps) {
  const { isLoading, canJoin, error, joinChannel, leaveChannel } =
    useChannelMembership(channel);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const label = canJoin ? 'Join channel' : 'Leave channel';

  const getIcon = () => {
    if (isLoading) {
      return <LoadingIcon />;
    }
    return canJoin ? <ImEnter /> : <ImExit />;
  };

  return (
    <>
      <ChannelOverlayIconButton
        icon={getIcon()}
        label={label}
        disabled={isLoading}
        onClick={() => {
          if (canJoin) {
            if (channel.hasPassword) {
              setModalOpen(true);
            } else {
              joinChannel(null);
            }
          } else {
            leaveChannel();
          }
        }}
      />
      <JoinChannelWithPasswordModal
        isOpen={isModalOpen}
        isLoading={isLoading}
        error={error}
        joinChannel={joinChannel}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

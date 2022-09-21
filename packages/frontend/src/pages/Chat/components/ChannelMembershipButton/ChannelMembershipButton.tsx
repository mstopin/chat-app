import { useState } from 'react';
import { IoEnter, IoExit } from 'react-icons/io5';

import { Channel } from '../../../../types';

import useChannelMembership from './hooks/useChannelMembership';
import Button from './Button';
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

  return (
    <>
      <Button
        isLoading={isLoading}
        label={label}
        icon={canJoin ? <IoEnter /> : <IoExit />}
        onClick={(e) => {
          e.preventDefault();
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

import { IoEnter, IoExit } from 'react-icons/io5';

import { Channel } from '../../../../types';

import useChannelMembership from './hooks/useChannelMembership';
import Button from './Button';

interface ChannelMembershipButtonProps {
  channel: Channel;
}

export default function ChannelMembershipButton({
  channel,
}: ChannelMembershipButtonProps) {
  const { isLoading, joinChannel, leaveChannel } =
    useChannelMembership(channel);

  const label = joinChannel ? 'Join channel' : 'Leave channel';

  return (
    <Button
      isLoading={isLoading}
      label={label}
      icon={joinChannel ? <IoEnter /> : <IoExit />}
      onClick={(e) => {
        e.preventDefault();
        (joinChannel ?? leaveChannel)!();
      }}
    />
  );
}

import { useState } from 'react';

import { useUser } from '../../../../../hooks/useUser';
import { useStore } from '../../../../../store';
import { Channel, User } from '../../../../../types';

import { ChannelFilter } from '../../../types';

type FilterStrategy = (c: Channel) => boolean;
type FilterStrategyCreator = (u: User) => FilterStrategy;

const createJoinedChannelsFilterStrategy: FilterStrategyCreator = (u: User) => {
  return (c: Channel) =>
    c.owner.id === u.id || !!c.members.find((m) => m.id === u.id);
};

const createJoinableChannelsFilterStrategy: FilterStrategyCreator = (
  u: User
) => {
  return (c: Channel) =>
    c.owner.id !== u.id && !c.members.find((m) => m.id === u.id);
};

export function useFilteredChannels() {
  const { user } = useUser();
  const channels = useStore((state) => state.channels);
  const [filter, setFilter] = useState<ChannelFilter>(
    ChannelFilter.JOINED_CHANNELS
  );

  const createFilterStrategy: () => FilterStrategy = () => {
    return filter === ChannelFilter.JOINED_CHANNELS
      ? createJoinedChannelsFilterStrategy(user!)
      : createJoinableChannelsFilterStrategy(user!);
  };

  const filteredChannels = (channels.data ?? []).filter(createFilterStrategy());

  return {
    channels: filteredChannels,
    isLoading: channels.isLoading || channels.error,
    filter,
    setFilter,
  };
}

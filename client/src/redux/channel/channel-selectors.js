import { createSelector } from 'reselect';

const selectChannelDomain = (state) => state.channel;

export const selectCurrentChannel = createSelector(
  [selectChannelDomain],
  (channel) => channel.currentChannel
);

export const selectChannels = createSelector(
  [selectChannelDomain],
  (channel) => channel.channels
);

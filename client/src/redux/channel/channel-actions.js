import ChannelActionTypes from './channel-types';

export const setCurrentChannel = (email) => ({
  type: ChannelActionTypes.SET_CHANNEL,
  payload: email,
});

export const setChannels = (channels) => ({
  type: ChannelActionTypes.SET_CHANNELS,
  payload: channels,
});

export const clearCurrentChannel = () => ({
  type: ChannelActionTypes.CLEAR_CHANNEL,
});

export const makeLocalMessage = (message) => ({
  type: ChannelActionTypes.MAKE_MESSAGE,
  payload: message,
});

export const setLocalWithCurrent = (data) => ({
  type: ChannelActionTypes.SET_CHANNELS_WITH_CURRENT,
  payload: data,
});

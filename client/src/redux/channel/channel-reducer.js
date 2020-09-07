import ChannelActionTypes from './channel-types';
import { findAndPasteMessage } from './utils';
const INIT_STATE = {
  channels: [],
  currentChannel: null,
};

const channelReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ChannelActionTypes.SET_CHANNELS_WITH_CURRENT:
      const { current, channel } = action.payload;
      return {
        ...state,
        currentChannel: current,
        channels: [...state.channels, channel],
      };
    case ChannelActionTypes.SET_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload,
      };
    case ChannelActionTypes.CLEAR_CHANNEL:
      return {
        ...state,
        currentChannel: null,
      };
    case ChannelActionTypes.SET_CHANNELS:
      return {
        ...state,
        channels: action.payload,
      };
    case ChannelActionTypes.MAKE_MESSAGE:
      return {
        ...state,
        channels: findAndPasteMessage(state.channels, action.payload),
      };
    default: {
      return state;
    }
  }
};

export default channelReducer;

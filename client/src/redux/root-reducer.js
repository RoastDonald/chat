import { combineReducers } from 'redux';
import userReducer from './user/user-reducer';
import channelReducer from './channel/channel-reducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const config = {
  key: 'root',
  storage,
  whitelist: ['user'],
  blacklist: ['channel'],
};

export default persistReducer(
  config,
  combineReducers({
    user: userReducer,
    channel: channelReducer,
  })
);

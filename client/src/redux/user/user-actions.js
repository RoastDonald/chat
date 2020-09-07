import UserActionTypes from './user-types';

export const setUser = (userData) => ({
  type: UserActionTypes.SET_USER,
  payload: userData,
});

export const clearUser = () => ({
  type: UserActionTypes.CLEAR_USER,
});

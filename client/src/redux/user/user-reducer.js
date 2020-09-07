import UserActionTypes from './user-types';

const INITIAL_STATE = {
  token: null,
  currentUser: null,
  email: null,
  id: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.displayName,
        token: action.payload.token,
        email: action.payload.email,
        id: action.payload._id,
      };
    case UserActionTypes.CLEAR_USER:
      return {
        ...state,
        currentUser: null,
        token: null,
        email: null,
      };
    default:
      return state;
  }
};

export default userReducer;

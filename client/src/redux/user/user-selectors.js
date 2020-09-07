import { createSelector } from 'reselect';

const selectUserDomain = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUserDomain],
  (user) => user.currentUser
);

export const selectUserEmail = createSelector(
  [selectUserDomain],
  (user) => user.email
);

export const selectUserToken = createSelector(
  [selectUserDomain],
  (user) => user.token
);

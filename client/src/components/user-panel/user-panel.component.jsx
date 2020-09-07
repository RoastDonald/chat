import React from 'react';
import { clearUser } from '../../redux/user/user-actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { clearCurrentChannel } from '../../redux/channel/channel-actions';
import { selectCurrentUser } from '../../redux/user/user-selectors';
import {
  UserPannelWrapper,
  LogoutIcon,
  LogoWrapper,
  LogoIcon,
} from './user-panel.styles';

import './user-panel.styles.scss';

const UserPanel = ({ clearUser, currentUser, clearCurrentChannel }) => {
  const logOut = () => {
    clearCurrentChannel();
    clearUser();
  };

  if (currentUser.length > 15) currentUser = currentUser.slice(0, 15) + '...';
  return (
    <UserPannelWrapper>
      <LogoWrapper>
        <LogoIcon />
        <div className="logo">
          <span className="logo__title">Chat app</span>
          <span className="logo__description">{currentUser}, welcome</span>
        </div>
      </LogoWrapper>

      <LogoutIcon onClick={logOut} />
    </UserPannelWrapper>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearUser: () => dispatch(clearUser()),
  clearCurrentChannel: () => dispatch(clearCurrentChannel()),
});

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPanel);

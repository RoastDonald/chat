import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectCurrentChannel } from '../../redux/channel/channel-selectors';
import { selectUserEmail } from '../../redux/user/user-selectors';
import { AvatartWithStatus } from '../dialogs-panel/result-box.component';
import { createStructuredSelector } from 'reselect';
import SocketManager from '../../utils/socket-connection';
import './info-panel.styles.scss';

const InfoPanel = ({ currentChannel, userEmail }) => {
  const [isOnline, setStatus] = useState(false);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    let contributers = null;
    if (SocketManager.socket && currentChannel) {
      setDisplayName(currentChannel.displayName);

      //if navigation from dialogs pannel
      if (currentChannel.users) {
        contributers = currentChannel.users.filter(
          (user) => user.email !== userEmail
        );
        setDisplayName(contributers[0].name);

        console.log(currentChannel.displayName);
      }

      const reciveUserStatus = (data) => {
        setStatus(data);
      };
      const checkUserStatus = () => {
        SocketManager.socket.emit('client:pock-user', {
          data: {
            email:
              (contributers && contributers[0].email) || currentChannel.email,
          },
        });
      };
      checkUserStatus();
      const intervalId = setInterval(checkUserStatus, 5000);
      SocketManager.socket.on('server:pock-user', reciveUserStatus);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentChannel]);

  if (currentChannel) {
    return (
      <div className="info-panel">
        <div className="info-panel__user">
          <div>
            <span
              className="user-content__status status-info"
              style={{
                backgroundColor: isOnline ? '#15d61a' : 'grey',
              }}
            ></span>
            <AvatartWithStatus size={48} />
          </div>

          <div className="user-meta">
            <span>{displayName}</span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div className="info-panel__actions">
          {/* <span
          className="user-content__status "
          style={{
            backgroundColor: isOnline ? '#15d61a' : 'grey',
          }}
        ></span>
        <AvatartWithStatus /> */}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToProps = createStructuredSelector({
  currentChannel: selectCurrentChannel,
  userEmail: selectUserEmail,
});

export default connect(mapStateToProps)(InfoPanel);

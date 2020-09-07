import React, { useEffect, useState } from 'react';
import { List, Avatar, Typography } from 'antd';
import { getColor } from '../../../utils/helper';
import axios from 'axios';
import moment from 'moment';
import {
  setChannels,
  setCurrentChannel,
  makeLocalMessage,
  setLocalWithCurrent,
} from '../../../redux/channel/channel-actions';
import Spinner from '../../spinner/spinner.component';
import { createStructuredSelector } from 'reselect';
import { selectChannels } from '../../../redux/channel/channel-selectors';
import SocketManager from '../../../utils/socket-connection';
import { connect } from 'react-redux';
import { selectUserEmail } from '../../../redux/user/user-selectors';
const { Title, Text } = Typography;

const Dialogs = ({
  token,
  setChannels,
  channels,
  setCurrentChannel,
  currentUserEmail,
  makeLocalMessage,
  setLocalWithCurrent,
}) => {
  const [isLoading, setLoading] = useState(true);
  const handleMessage = (data) => {
    console.log(data);
    makeLocalMessage(data);
  };

  const recieveChannel = (channel) => {
    setLocalWithCurrent({
      channel,
      current: channel,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      SocketManager.socket.on('server:onFirstMessage', recieveChannel);
      SocketManager.socket.on('server:message', handleMessage);
    }, 0);

    axios
      .get('/api/profile/channels/', {
        headers: {
          'x-auth': token,
        },
      })
      .then((res) => {
        setChannels(res.data[0].result);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      if (SocketManager.socket) {
        SocketManager.socket.removeListener(recieveChannel);
      }
    };
  }, []);

  return (
    <div className="dialogs-panel__content">
      {isLoading ? (
        <Spinner transparent />
      ) : (
        <List
          className="dialogs-panel__list"
          itemLayout="horizontal"
          dataSource={channels}
          renderItem={(item) => {
            console.log(item);
            let lastMessage = item.messages[item.messages.length - 1];
            let users = item.users.filter(
              (user) => user.email !== currentUserEmail
            );
            let userString = '';
            users.forEach((user) => {
              userString += ` ${user.name} `;
            });

            let locale = new Date(lastMessage.timestamp);
            let content = lastMessage.content;

            return (
              <List.Item
                key={item._id}
                onClick={() => setCurrentChannel(item)}
                style={{ borderBottom: 'none' }}
                className="dialogs-panel__item"
              >
                <Avatar
                  style={{ background: getColor(), marginLeft: '15px' }}
                />
                <div className="dialog-meta">
                  <Title
                    level={4}
                    style={{
                      color: '#fff',
                      marginBottom: '6px',
                      justifyContent: 'space-between',
                      width: '100%',
                      display: 'flex',
                      alignContent: 'baseline',
                    }}
                  >
                    {userString}
                    <Text className="timestamp">
                      {moment(locale).fromNow()}
                    </Text>
                  </Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    {`${
                      lastMessage.user.senderEmail === currentUserEmail
                        ? 'you'
                        : lastMessage.user.senderName
                    }: ${content}`}
                  </Text>
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setChannels: (channels) => dispatch(setChannels(channels)),
  setCurrentChannel: (channel) => dispatch(setCurrentChannel(channel)),
  makeLocalMessage: (msg) => dispatch(makeLocalMessage(msg)),
  setLocalWithCurrent: (data) => dispatch(setLocalWithCurrent(data)),
});

const mapStateToProps = createStructuredSelector({
  channels: selectChannels,
  currentUserEmail: selectUserEmail,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dialogs);

import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'antd';

import moment from 'moment';
import Animate from 'rc-animate';
import { ReactComponent as SelectChatSVG } from '../../assets/select.svg';
import './content-panel.styles.scss';
import SocketManager from '../../utils/socket-connection';

const ContentPanel = ({ currentChannel, userEmail, channels }) => {
  const [messages, setMessages] = useState([]);
  const bottomChat = useRef(null);

  useEffect(() => {
    bottomChat.current.scrollIntoView();
    if (currentChannel && currentChannel.messages) {
      setMessages(currentChannel.messages);
    } else {
      setMessages([]);
    }
  }, [channels, currentChannel]);

  return (
    <div className="content-wrapper">
      {(currentChannel &&
        messages &&
        messages.map((message, indx) => {
          const isMine = message.user.senderEmail === userEmail;
          const time = moment(new Date(message.timestamp));
          return (
            <Animate component="" transitionName="fade" key={indx}>
              <div
                key={message._id}
                className="user-message"
                style={{ alignSelf: isMine ? 'flex-end' : 'flex-start' }}
              >
                <div className="message-content">
                  <span className="message-content__time">
                    {time.format('LT')}
                  </span>
                  {isMine ? null : <Avatar />}
                  <span
                    className="message-content__message"
                    style={{
                      backgroundColor: isMine
                        ? '#006AFF'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    {message.content}
                  </span>
                </div>
              </div>
            </Animate>
          );
        })) || (
        <div className="content-panel__message">
          <div className="message-container">
            <SelectChatSVG width={128} height={128} />
            <span className="message">please, select room</span>
          </div>
        </div>
      )}
      <div style={{ float: 'left', clear: 'both' }} ref={bottomChat}></div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
  userEmail: state.user.email,
  channels: state.channel.channels,
});

// const mapStateToProps = createStructuredSelector({
//   currentChannel: selectCurrentChannel,
//   userEmail: selectUserEmail,
//   channels: selectChannels,
// });

export default connect(mapStateToProps)(ContentPanel);

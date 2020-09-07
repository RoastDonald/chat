import React, { useState } from 'react';
import { Input, Form, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './input-panel.styles.scss';
import { selectCurrentChannel } from '../../redux/channel/channel-selectors';
import { v4 as uuidv4 } from 'uuid';
import { makeLocalMessage } from '../../redux/channel/channel-actions';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectUserEmail,
  selectCurrentUser,
} from '../../redux/user/user-selectors';
import SocketManaget from '../../utils/socket-connection';
const InputPanel = ({
  currentChannel,
  senderName,
  senderEmail,
  makeLocalMessage,
}) => {
  const [input, setInput] = useState('');
  const makeMessag = () => {
    const { email: recieverEmail, displayName: recieverName } = currentChannel;

    if (currentChannel.messages) {
      const message = {
        channelID: currentChannel._id,
        message: {
          _id: uuidv4(),
          content: input,
          timestamp: Date.now(),
          user: {
            senderEmail,
            senderName,
          },
        },
      };
      makeLocalMessage(message);

      const chatUsers = currentChannel.users.filter(
        (user) => user.email !== senderEmail
      );

      SocketManaget.socket.emit('client:message', {
        data: {
          from: { senderEmail, senderName },
          to: chatUsers,
          channelID: currentChannel._id,
          message: input,
          meta: message,
        },
      });
    } else {
      SocketManaget.socket.emit('client:onFirstMessage', {
        data: {
          from: { senderEmail, senderName },
          to: { recieverEmail, recieverName },
          message: input,
        },
      });
    }
    setInput('');
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  if (currentChannel) {
    return (
      <div className="input-panel">
        <Form
          onFinish={makeMessag}
          layout="inline"
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Form.Item
            style={{ flex: '1 0 70%', height: '100%', alignItems: 'center' }}
          >
            <Input
              onChange={onInputChange}
              value={input}
              placeholder="Enter your message"
              className="input-panel__input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="submit"
              onClick={makeMessag}
              icon={<SendOutlined size={64} />}
            />
          </Form.Item>
        </Form>
      </div>
    );
  } else {
    return null;
  }
};

const mapStateToProps = createStructuredSelector({
  currentChannel: selectCurrentChannel,
  senderEmail: selectUserEmail,
  senderName: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  makeLocalMessage: (message) => dispatch(makeLocalMessage(message)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InputPanel);

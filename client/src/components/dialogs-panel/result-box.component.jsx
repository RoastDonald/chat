import React, { useEffect, useState } from 'react';
import { Avatar } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../redux/channel/channel-actions';
import { selectChannels } from '../../redux/channel/channel-selectors';
import {
  LoadingOutlined,
  UserOutlined,
  FireOutlined,
  FrownOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { createStructuredSelector } from 'reselect';

const getColor = () => {
  let H = Math.floor(Math.random() * 240);
  return `linear-gradient(hsl(${H},100%,70%),hsl(${H},100%,30%))`;
};

export const AvatartWithStatus = styled((props) => (
  <Avatar icon={<UserOutlined />} {...props} />
))`
  background-image: ${false ? `` : getColor()};
`;

const ResultBox = ({
  token,
  searchText,
  setCurrentChannel,
  setReady,
  channels,
}) => {
  const [emails, setEmails] = useState([]);
  const [users, setUsers] = useState([]);
  const [isFetching, setFetching] = useState(true);
  const [privateChannels, setPrivateChannels] = useState([]);
  useEffect(() => {
    const privateLocal = channels.filter((channel) => {
      return channel.users.length == 2;
    });

    const emails = privateLocal
      .map((channel) => channel.users.map((user) => user.email))
      .flat();
    setEmails(emails);
    setPrivateChannels(privateLocal);
  }, [channels]);

  useEffect(() => {
    const searchApi = `/api/users?search=${searchText}`;
    axios
      .get(
        searchApi,
        {
          headers: {
            'x-auth': token,
          },
        },
        [searchText]
      )
      .then(({ data: { users } }) => {
        const editedUsers = users.map((user) => {
          return {
            ...user,
            isLocal: emails.includes(user.email),
          };
        });
        console.log(editedUsers);
        setUsers(editedUsers);
        setFetching(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [searchText, token, emails]);

  return isFetching ? (
    <LoadingOutlined style={{ fontSize: '16px', color: '#fff' }} />
  ) : (
    <div className="user-box">
      {users.length ? (
        users.map((user) => (
          <div
            className="user-box__item"
            key={user.email}
            style={{
              backgroundColor: user.isLocal ? '#4285F4' : '',
            }}
            onClick={() => {
              if (user.isLocal) {
                let localChannel = privateChannels.find((channel) => {
                  return !!channel.users.find(
                    (chUser) => chUser.email === user.email
                  );
                });
                console.log(localChannel);
                setCurrentChannel(localChannel);
              } else {
                setCurrentChannel(user);
              }

              //close box
              setReady(false);
            }}
          >
            <div className="user-content">
              <span
                className="user-content__status"
                style={{
                  backgroundColor: user.status ? '#15d61a' : 'grey',
                }}
              ></span>
              <AvatartWithStatus />
              <span className="user-name">{user.displayName}</span>
              <FireOutlined
                className="user-content__action"
                style={{ fontSize: '16px', color: '#fff' }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="user-box__message">
          <FrownOutlined style={{ fontSize: '24px', color: '#fff' }} />
          <span>no users</span>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCurrentChannel: (email) => dispatch(setCurrentChannel(email)),
});

const mapStateToProps = createStructuredSelector({
  channels: selectChannels,
});

export default connect(mapStateToProps, mapDispatchToProps)(ResultBox);

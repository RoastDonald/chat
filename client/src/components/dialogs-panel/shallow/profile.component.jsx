import React from 'react';
import { Row, Col, Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import {
  selectCurrentUser,
  selectUserEmail,
} from '../../../redux/user/user-selectors';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
const { Title } = Typography;

const Profile = ({ currentUser, userEmail }) => {
  console.log(currentUser);
  return (
    <Row style={{ minHeight: '90%' }}>
      <Col style={{ width: '100%' }}>
        <div className="profile-content">
          <Avatar
            size={86}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#4285F4' }}
          />
          <Title
            style={{
              color: '#fff',
              fontSize: '18px',
              padding: '5px',
            }}
          >
            <div className="profile-info">
              username:{' '}
              <span className="profile-info__item">{currentUser}</span>
            </div>

            <div className="profile-info">
              email: <span className="profile-info__item">{userEmail}</span>
            </div>
          </Title>
        </div>
      </Col>
    </Row>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  userEmail: selectUserEmail,
});

export default connect(mapStateToProps)(Profile);

import React, { useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { setUser } from '../redux/user/user-actions';
import { connect } from 'react-redux';

import axios from 'axios';
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { Row, Col, Typography, Input, Form, Checkbox, Button } from 'antd';
import AlianSvg from './shallow/alien.component';
import {
  rowStyle,
  colStyle,
  flashStyle,
  box,
  whiteColor,
  iconStyles,
} from './styles';
const { Title, Paragraph, Text } = Typography;

const INITTIAL_STATE_INPS = {
  email: '',
  password: '',
  remember: true,
};

const inpsReducer = (state, action) => {
  let { name, value, checked } = action;
  if (name === 'remember') value = checked;
  return { ...state, [name]: value };
};

const AuthPage = ({ setUser }) => {
  const [inpState, dispatchInps] = useReducer(inpsReducer, INITTIAL_STATE_INPS);
  const [isFetching, setFetching] = useState(false);
  const [isPassword, setPassValid] = useState(true);
  const [isEmail, setEmailValid] = useState(true);
  const [isMessageActive, setMessageActive] = useState(false);
  const [message, setMessage] = useState('');

  const showMessage = (message) => {
    setMessageActive(true);
    setMessage(message);
  };

  const resetValidation = () => {
    setPassValid(true);
    setEmailValid(true);
  };

  const handleSubmit = () => {
    resetValidation();
    setFetching(true);
    const { email, password } = inpState;
    axios
      .post('/api/auth', {
        email,
        password,
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500)
            return showMessage('Server error', 'error');

          let errorString = '';
          const errors = error.response.data.errors;
          const message = errors[0].message;
          if (message) {
            return showMessage(message, 'error');
          }
          for (let error of errors) {
            errorString += error.param || ' ';
          }
          console.log(errorString);
          if (errorString.includes('email')) {
            setEmailValid(false);
          }
          if (errorString.includes('password')) {
            setPassValid(false);
          }
        }
      })
      .finally(() => {
        setFetching(false);
      });
  };

  return (
    <div className="auth-page">
      <Row align="middle" justify="center" style={rowStyle}>
        <Col
          style={colStyle}
          align="middle"
          xs={20}
          sm={14}
          md={12}
          lg={8}
          xl={6}
          xxl={6}
          className="container"
        >
          <AlianSvg page="signin" />
          <Col className="auth__left">
            <UserOutlined style={{ fontSize: '60px', color: '#1890ff' }} />
            <Title level={2} style={{ color: '#fff' }}>
              Sign in
            </Title>
            <Form
              onFinish={handleSubmit}
              // initialValues={{
              //   remember: true,
              // }}
              style={{ maxWidth: '350px' }}
            >
              <Form.Item
                hasFeedback
                validateStatus={isEmail ? '' : 'error'}
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email',
                  },
                ]}
              >
                <Input
                  name="email"
                  value={inpState.email}
                  onChange={(e) => dispatchInps(e.target)}
                  size="large"
                  prefix={<UserOutlined style={{ fontSize: '15px' }} />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                hasFeedback
                validateStatus={isPassword ? '' : 'error'}
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password',
                  },
                ]}
              >
                <Input
                  name="password"
                  size="large"
                  value={inpState.password}
                  onChange={(e) => dispatchInps(e.target)}
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox
                    name="remember"
                    value={inpState.remember}
                    onChange={(e) => dispatchInps(e.target)}
                    style={{ float: 'left', color: '#fff' }}
                  >
                    Remember me
                  </Checkbox>
                </Form.Item>
                <a href="/" style={{ float: 'right' }}>
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  loading={isFetching}
                  shape="round"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    marginBottom: '6px',
                  }}
                >
                  Sign in
                </Button>
              </Form.Item>

              <Form.Item>
                <div className="auth__media">
                  <GoogleOutlined style={iconStyles} />
                  <GithubOutlined style={iconStyles} />
                  <LinkedinOutlined style={iconStyles} />
                </div>
              </Form.Item>
            </Form>
            {isMessageActive ? <Text style={flashStyle}>{message}</Text> : null}
          </Col>

          <Col className="auth__right" style={box}>
            <Col style={{ width: '80%' }}>
              <Title level={2} style={whiteColor}>
                Welcome to Chat
              </Title>
              <Paragraph style={whiteColor}>
                To start off the session, we need your personal details
              </Paragraph>
              <Link to="/signup">
                <Button
                  className="btn-effect"
                  shape="round"
                  size="large"
                  ghost={true}
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    marginBottom: '6px',
                  }}
                >
                  Sign up
                </Button>
              </Link>
            </Col>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
});

export default connect(null, mapDispatchToProps)(AuthPage);

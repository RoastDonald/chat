import React, { useState, useReducer } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../redux/user/user-actions';
import { connect } from 'react-redux';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  GoogleOutlined,
  GithubOutlined,
  LinkedinOutlined,
} from '@ant-design/icons';
import { Row, Col, Typography, Input, Form, Button } from 'antd';
import AlianSvg from './shallow/alien.component';

import { rowStyle, UserOutlinedStyled, flashStyle } from './styles';
const { Title, Text } = Typography;

const INITIAL_STATE_INPS = {
  displayName: '',
  email: '',
  password: '',
};

const inpReducer = (state = INITIAL_STATE_INPS, action) => {
  let { name, value } = action;
  return { ...state, [name]: value };
};

const RegisterPage = ({ setUser }) => {
  const [{ displayName, email, password }, dispatchInps] = useReducer(
    inpReducer,
    INITIAL_STATE_INPS
  );

  const [state, setState] = useState({
    isLoading: false,
    isEmailValid: true,
    isPasswordValid: true,
    isMessageActive: false,
    message: '',
  });

  const {
    isLoading,
    isEmailValid,
    isPasswordValid,
    isMessageActive,
    message,
  } = state;

  const resetValidation = () => {
    setState({
      ...state,
      isEmailValid: true,
      isPasswordValid: true,
    });
  };

  const showMessage = (message) => {
    setState({
      ...state,
      message: message,
      isMessageActive: true,
    });
  };

  const handleSubmit = () => {
    resetValidation();
    setState({ ...state, isLoading: true });
    axios
      .post('/api/users', {
        displayName,
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
            errorString += error.param.toString() || ' ';
          }
          if (errorString.includes('email')) {
            setState({ ...state, isEmailValid: false });
          }
          if (errorString.includes('password')) {
            setState({ ...state, isPasswordValid: false });
          }
        }
      })
      .finally(() => {
        setState({ ...state, isLoading: false });
      });
  };

  return (
    <div className="register-page">
      <Row align="middle" justify="center" style={rowStyle}>
        <Col
          align="middle"
          xs={20}
          sm={14}
          md={12}
          lg={8}
          xl={6}
          xxl={6}
          className="container"
        >
          <AlianSvg />
          <Col className="register__left">
            <UserOutlinedStyled size="60" />
            <Title level={2} style={{ color: '#fff' }}>
              Sign up
            </Title>
            <Form
              onFinish={handleSubmit}
              initialValues={{
                remember: true,
              }}
              style={{ maxWidth: '300px' }}
            >
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: 'Please enter your displayName',
                  },
                ]}
              >
                <Input
                  value={displayName}
                  onChange={(e) => dispatchInps(e.target)}
                  name="displayName"
                  size="large"
                  prefix={<UserOutlined style={{ fontSize: '15px' }} />}
                  placeholder="displayName"
                />
              </Form.Item>
              <Form.Item
                hasFeedback
                validateStatus={isEmailValid ? '' : 'error'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email',
                  },
                ]}
              >
                <Input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => dispatchInps(e.target)}
                  size="large"
                  prefix={<MailOutlined style={{ fontSize: '15px' }} />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                hasFeedback
                validateStatus={isPasswordValid ? '' : 'error'}
                rules={[
                  {
                    required: true,
                    message: 'Please enter your password',
                  },
                ]}
              >
                <Input
                  name="password"
                  value={password}
                  onChange={(e) => dispatchInps(e.target)}
                  size="large"
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={isLoading}
                  size="large"
                  shape="round"
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    marginBottom: '6px',
                  }}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
            {isMessageActive ? <Text style={flashStyle}>{message}</Text> : null}
            <div className="register__links">
              <Link to="/signin">I already have an account</Link>
            </div>
          </Col>
          <Col className="register__right">
            <Col style={{ width: '80%' }} className="media-btns">
              <Button
                className="btn-effect"
                size="large"
                htmlType="submit"
                style={{
                  width: '100%',
                  marginBottom: '6px',
                  backgroundColor: '#fff',
                }}
              >
                <GoogleOutlined />
                sign up with google
              </Button>

              <Button
                className="btn-effect"
                size="large"
                htmlType="submit"
                style={{
                  width: '100%',
                  marginBottom: '6px',
                  backgroundColor: '#fff',
                }}
              >
                <GithubOutlined />
                sign up with github
              </Button>

              <Button
                className="btn-effect"
                size="large"
                htmlType="submit"
                style={{
                  width: '100%',
                  marginBottom: '6px',
                  backgroundColor: '#fff',
                }}
              >
                <LinkedinOutlined />
                sign up with linked in
              </Button>
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

export default connect(null, mapDispatchToProps)(RegisterPage);

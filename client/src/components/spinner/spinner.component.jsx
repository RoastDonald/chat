import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Typography } from 'antd';
const { Title } = Typography;

const Overlay = styled.div`
  height: 100%;
  background-color: ${({ transparent }) =>
    transparent ? 'transparent ' : '#1a1a1a'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const textStyle = {
  fontSize: '32px',
  color: '#fff',
};

const Spinner = ({ transparent }) => (
  <Overlay transparent={transparent}>
    <LoadingOutlined style={{ fontSize: 100, color: '#fff' }} />
    <Title style={textStyle}>Loading</Title>
  </Overlay>
);

export default Spinner;

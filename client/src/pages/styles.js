import styled from 'styled-components';
import { UserOutlined } from '@ant-design/icons';

export const whiteColor = {
  color: '#fff',
};
export const rowStyle = {
  height: '100vh',
};

export const iconStyles = {
  fontSize: '32px',
};

export const box = {
  color: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const colStyle = {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
  zIndex: 100,
};

export const flashStyle = {
  color: '#FFBABA',
  fontSize: '18px',
  position: 'relative',
  top: '-20px',
};

export const UserOutlinedStyled = styled(UserOutlined)`
  font-size: ${({ size }) => (size ? size : 16)}px;
  color: #1890ff !important;
`;

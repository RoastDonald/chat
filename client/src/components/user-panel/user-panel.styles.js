import styled from 'styled-components';
import { ReactComponent as Logout } from '../../assets/signs.svg';
import { ReactComponent as UFO } from '../../assets/nature.svg';

export const LogoIcon = styled(UFO)`
  transform: rotate(-20deg);
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
`;

export const LogoWrapper = styled.div`
  margin-left: 10px;
  font-size: 36px;
  display: flex;
  align-items: center;
  color: #fff;
`;

export const LogoutIcon = styled(Logout)`
  fill: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: block;
  min-width: 24px;
  min-height: 24px;
`;

export const UserPannelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0 5px;
`;

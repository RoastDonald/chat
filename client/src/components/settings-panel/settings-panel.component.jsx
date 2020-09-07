import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import {
  WechatOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import './settings-panel.styles.scss';

const iconsStyle = { fontSize: '24px', color: '#fff' };
const SettingsPanel = () => (
  <div className="settings-panel">
    <NavLink
      to="/"
      isActive={(match, location) => location.pathname === '/'}
      activeClassName="active"
    >
      <WechatOutlined className="settings-panel__item" style={iconsStyle} />
    </NavLink>
    <NavLink to="/profile" activeClassName="active">
      <UserOutlined className="settings-panel__item" style={iconsStyle} />
    </NavLink>
    <NavLink to="/settings" activeClassName="active">
      <SettingOutlined className="settings-panel__item" style={iconsStyle} />
    </NavLink>
  </div>
);

export default withRouter(SettingsPanel);

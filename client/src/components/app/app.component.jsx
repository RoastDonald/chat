import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { selectUserEmail } from '../../redux/user/user-selectors';

import DialogsPanel from '../dialogs-panel/dialogs-panel.component';
import UserPanel from '../user-panel/user-panel.component';
import SettingsPanel from '../settings-panel/settings-panel.component';
import ContentPanel from '../content-panel/content-panel.component';
import InfoPanel from '../info-panel/info-panel.component';
import InputPanel from '../input-panel/input-panel.component';
import SocketManager from '../../utils/socket-connection';
import './app.styles.scss';

const App = ({ email }) => {
  useEffect(() => {
    SocketManager.getConnection(email);
    return () => {
      SocketManager.disconnectFromServer();
    };
  }, [email]);
  return (
    <div className="app">
      <Row className="controll-panel">
        <Col className="app-container">
          <Row className="controll-panel__user fluid">
            <UserPanel />
          </Row>
          <Row className="controll-panel__dialogs fluid">
            <DialogsPanel />
          </Row>
          <Row className="controll-panel__settings fluid">
            <SettingsPanel />
          </Row>
        </Col>
      </Row>

      <Row className="chat-panel">
        <Col className="app-container">
          <Row className="chat-panel__info fluid">
            <InfoPanel />
          </Row>
          <Row className="chat-panel__content fluid">
            <ContentPanel />
          </Row>
          <Row className="chat-panel__input fluid">
            <InputPanel />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  email: selectUserEmail,
});

export default connect(mapStateToProps)(App);

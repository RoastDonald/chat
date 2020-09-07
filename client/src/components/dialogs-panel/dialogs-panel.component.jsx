import React, { Fragment } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectUserToken } from '../../redux/user/user-selectors';
import './dialogs-panel.styles.scss';

import Profile from './shallow/profile.component';
import Search from './shallow/search.component';
import Dialogs from './shallow/dialogs.component';

const DialogsPanel = ({ token, match: { url } }) => {
  const DialogsWithToken = () => <Dialogs token={token} />;
  const Test = () => <div>1</div>;
  console.log(url);
  return (
    <Fragment>
      <Search token={token} />
      <Switch>
        <Route exact path={`${url}`} component={DialogsWithToken} />
        <Route exact path={`/profile`} component={Profile} />
        <Route exact path={`/settings`} component={Test} />
      </Switch>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserToken,
});

export default withRouter(connect(mapStateToProps)(DialogsPanel));

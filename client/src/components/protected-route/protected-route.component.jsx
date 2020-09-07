import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user-selectors';

const ProtectedRoute = ({ currentUser, component: Component, ...props }) => (
  <Route
    {...props}
    render={(props) =>
      currentUser ? <Component {...props} /> : <Redirect to="/signin" />
    }
  />
);

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(ProtectedRoute);

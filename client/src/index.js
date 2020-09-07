import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store, persistor } from './redux/store';
import { createStructuredSelector } from 'reselect';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from 'react-router-dom';

import BackSvg from './pages/shallow/back-svg.component';
import Spinner from './components/spinner/spinner.component';
import ProtectedRoute from './components/protected-route/protected-route.component';

import 'antd/dist/antd.css';
import './index.css';
import { selectCurrentUser } from './redux/user/user-selectors';

const AppLazy = React.lazy(() => import('./components/app/app.component'));
const RegisterPageLazy = React.lazy(() => import('./pages/signup.component'));
const AuthPageLazy = React.lazy(() => import('./pages/signin.component'));

const Root = ({ history, currentUser, location }) => {
  useEffect(() => {
    if (currentUser) {
      history.push('/');
    } else {
      history.push('/signin');
    }
  }, [currentUser, history]);
  const { pathname } = location;
  return (
    <Suspense fallback={<Spinner />}>
      <ProtectedRoute path="/" component={AppLazy} />
      <Switch>
        <div className="auth-domain">
          {pathname === '/signin' || pathname === '/signup' ? (
            <BackSvg />
          ) : null}
          <div className="page-wrapper">
            <Route path="/signin" component={AuthPageLazy} />
            <Route path="/signup" component={RegisterPageLazy} />
          </div>
        </div>
      </Switch>
    </Suspense>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const RootWithRouter = compose(connect(mapStateToProps), withRouter)(Root);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <Router>
        <RootWithRouter />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

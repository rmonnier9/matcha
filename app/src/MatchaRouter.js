import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// Containers
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import Suggestions from './components/Suggestions.js';
import Matches from './components/Matches.js';
import Notifications from './components/Notifications.js';
import SearchContainer from './components/SearchContainer.js';
import ProfileContainer from './components/ProfileContainer.js';
import MyProfileContainer from './components/MyProfileContainer.js';
import ChatContainer from './components/ChatContainer.js';
import EmailConfirm from './components/EmailConfirm.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import ForgotPassword from './components/ForgotPassword.js';
import NotFound from './components/NotFound.js';

const MatchaRouter = (props) => {
  const { isAuthenticated } = props;

  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <PrivateRoute
            exact
            path="/"
            isAuthenticated={isAuthenticated}
            component={Suggestions}
          />
          <PrivateRoute
            path="/matches"
            isAuthenticated={isAuthenticated}
            component={Matches}
          />
          <PrivateRoute path="/notifications" isAuthenticated={isAuthenticated} component={Notifications} />
          <PrivateRoute path="/search" isAuthenticated={isAuthenticated} component={SearchContainer} />
          <PrivateRoute path="/profile/:login" isAuthenticated={isAuthenticated} component={ProfileContainer} />
          <PrivateRoute path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfileContainer} />
          <PrivateRoute path="/chat/:login" isAuthenticated={isAuthenticated} component={ChatContainer} />
          <Route path="/confirm" component={EmailConfirm} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot" component={ForgotPassword} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
};

MatchaRouter.propTypes = {
  isAuthenticated: PropTypes.bool,
};

MatchaRouter.defaultProps = {
  isAuthenticated: false,
};

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = (state) => {
  const { auth } = state;
  const { isAuthenticated } = auth;

  return {
    isAuthenticated,
  };
};

export default connect(mapStateToProps)(MatchaRouter);

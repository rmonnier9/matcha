import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// Containers
import Header from './components/Header';
import Footer from './components/Footer';
import Suggestions from './components/Suggestions';
import Notifications from './components/Notifications';
import SearchContainer from './components/SearchContainer';
import ProfileContainer from './components/ProfileContainer';
import MyProfileMatches from './components/MyProfileMatches';
import MyProfileVisits from './components/MyProfileVisits';
import MyProfileLikes from './components/MyProfileLikes';
import MyProfileContainer from './components/MyProfileContainer';
import ChatContainer from './components/ChatContainer';
import EmailConfirm from './components/EmailConfirm';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import NotFound from './components/NotFound';
import NotificationContainer from './components/NotificationContainer';

const MatchaRouter = ({ isAuthenticated }) => (
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
        <PrivateRoute path="/notifications" isAuthenticated={isAuthenticated} component={Notifications} />
        <PrivateRoute path="/search" isAuthenticated={isAuthenticated} component={SearchContainer} />
        <PrivateRoute path="/profile/:login" isAuthenticated={isAuthenticated} component={ProfileContainer} />
        <PrivateRoute exact path="/myprofile/matches" isAuthenticated={isAuthenticated} component={MyProfileMatches} />
        <PrivateRoute exact path="/myprofile/visits" isAuthenticated={isAuthenticated} component={MyProfileVisits} />
        <PrivateRoute exact path="/myprofile/likes" isAuthenticated={isAuthenticated} component={MyProfileLikes} />
        <PrivateRoute path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfileContainer} />
        <PrivateRoute path="/chat/:login" isAuthenticated={isAuthenticated} component={ChatContainer} />
        <Route path="/confirm" component={EmailConfirm} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <NotificationContainer />
    </div>
  </Router>
  );

MatchaRouter.propTypes = {
  isAuthenticated: PropTypes.bool,
};

MatchaRouter.defaultProps = {
  isAuthenticated: false,
};

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps)(MatchaRouter);

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';

// Components
import Footer from './components/Footer';
import MyProfileMatches from './components/MyProfileMatches';
import MyProfileVisits from './components/MyProfileVisits';
import MyProfileLikes from './components/MyProfileLikes';
import NotFound from './components/NotFound';

// Containers
import Header from './containers/Header';
import Suggestions from './containers/Suggestions';
import Notifications from './containers/Notifications';
import Search from './containers/Search';
import Profile from './containers/Profile';
import MyProfileContainer from './containers/MyProfile';
import Chat from './containers/Chat';
import EmailConfirm from './containers/EmailConfirm';
import Login from './containers/Login';
import Signup from './containers/Signup';
import ForgotPassword from './containers/ForgotPassword';
import NotificationsDisplayer from './containers/NotificationsDisplayer';

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
        <PrivateRoute path="/search" isAuthenticated={isAuthenticated} component={Search} />
        <PrivateRoute path="/profile/:login" isAuthenticated={isAuthenticated} component={Profile} />
        <PrivateRoute exact path="/myprofile/matches" isAuthenticated={isAuthenticated} component={MyProfileMatches} />
        <PrivateRoute exact path="/myprofile/visits" isAuthenticated={isAuthenticated} component={MyProfileVisits} />
        <PrivateRoute exact path="/myprofile/likes" isAuthenticated={isAuthenticated} component={MyProfileLikes} />
        <PrivateRoute path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfileContainer} />
        <PrivateRoute path="/chat/:login" isAuthenticated={isAuthenticated} component={Chat} />
        <Route path="/confirm" component={EmailConfirm} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <NotificationsDisplayer />
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

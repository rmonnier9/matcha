import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser, initNotificationsNumber } from '../actions';

import Nav from './Nav.js';

class Header extends Component {
  componentDidMount() {
    this.props.dispatch(initNotificationsNumber());
  }

  handleClick = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated, notificationsNumber } = this.props;
    return (
      <header className="header">
        {isAuthenticated &&
          <Nav
            notificationsNumber={notificationsNumber}
            handleClick={this.handleClick}
          />
        }
      </header>
    );
  }

}


//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = (state) => {
  const { auth, notification } = state;
  const { isAuthenticated, errorMessage } = auth;
  const { notificationsNumber } = notification;

  return {
    isAuthenticated,
    errorMessage,
    notificationsNumber,
  };
};

export default connect(mapStateToProps)(Header);

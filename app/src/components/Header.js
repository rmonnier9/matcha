import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authAction';
import { initNotificationsNumber } from '../actions/notifAction';

import Nav from './Nav';

class Header extends Component {
  componentDidMount() {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.props.dispatch(initNotificationsNumber());
    }
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

const mapStateToProps = ({
  auth: { isAuthenticated },
  notifications: { notificationsNumber },
}) => ({
  isAuthenticated,
  notificationsNumber,
});

export default connect(mapStateToProps)(Header);

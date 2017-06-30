import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/authAction';
import { initNotificationsNumber, receiveNotification } from '../actions/notifAction';
import NavBar from '../components/NavBar';

class Header extends Component {
  componentDidMount = () => {
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      this.initSocket();
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.isAuthenticated !== this.props.isAuthenticated && nextProps.isAuthenticated) {
      this.initSocket();
    }
  }

  initSocket = () => {
    this.props.dispatch(initNotificationsNumber());
    const token = localStorage.getItem('x-access-token');
    global.socket.open();
    global.socket.emit('auth', token);
    global.socket.on('notification', this.notificationReceive);
  }

  notificationReceive = (message) => {
    this.props.dispatch(receiveNotification(message, 'warning'));
  }

  handleSignOut = () => {
    this.props.dispatch(logoutUser());
    global.socket.removeListener('notification', this.notificationReceive);
    global.socket.disconnect();
  }

  render() {
    const { isAuthenticated, notificationsNumber } = this.props;
    return (
      <header className="header">
        {isAuthenticated &&
          <NavBar
            notificationsNumber={notificationsNumber}
            handleSignOut={this.handleSignOut}
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

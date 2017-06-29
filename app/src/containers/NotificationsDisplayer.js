import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { receiveNotification } from '../actions/notifAction';

class NotificationsDisplayer extends Component {
  componentDidMount = () => {
    global.socket.on('notification', this.notificationReceive);
  }

  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      message,
      level,
    });
  }

  notificationReceive = (message) => {
    this.props.dispatch(receiveNotification(message, 'warning'));
  }

  render() {
    return (
      <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
    );
  }
}

function mapStateToProps({ notifications: { last } }) {
  return {
    notification: last,
  };
}

export default connect(mapStateToProps)(NotificationsDisplayer);

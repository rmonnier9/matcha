import React, { Component } from 'react';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';

class NotificationsDisplayer extends Component {
  componentWillReceiveProps(newProps) {
    const { message, level } = newProps.notification;
    this.notificationSystem.addNotification({
      message,
      level,
    });
  }

  render() {
    return (
      <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
    );
  }
}

const mapStateToProps = ({ notifications: { last } }) => ({
  notification: last,
});

export default connect(mapStateToProps)(NotificationsDisplayer);

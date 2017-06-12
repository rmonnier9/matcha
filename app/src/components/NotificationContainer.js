import React from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import NotificationSystem from 'react-notification-system';
import { receiveNotification } from '../actions';

const socket = io();

class NotificationContainer extends React.Component {
  componentDidMount = () => {
    const token = localStorage.getItem('x-access-token');
    socket.emit('auth', token);
    socket.on('notification', this.notificationReceive);
    socket.on('message', this.messageReceive);
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

  messageReceive = (message) => {
    const { from } = message;
    this.props.dispatch(receiveNotification(`New message from ${from}`, 'warning'));
  }

  render() {
    return (
      <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
    );
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification.last,
  };
}

export default connect(mapStateToProps)(NotificationContainer);

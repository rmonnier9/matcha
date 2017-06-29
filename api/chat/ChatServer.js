import jwt from 'jsonwebtoken';
import _ from 'lodash';
import moment from 'moment';

import config from '../config/config';
import MongoConnection from '../config/MongoConnection';
import parserMessage from './parserMessage';
import * as Notifications from '../notifications/Notifications';

// reddis

class ChatServer {
  constructor(options) {
    this.io = options.io;
    this.users = [];
  }

  init() {
    this.io.on('connection', (socket) => {
      // console.log('connected');
      socket.on('auth', this.auth(socket));
    });
  }

  auth(socket) {
    return ((token) => {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) { socket.emit('auth', 'Auth error : Invalid token.'); return; }
        const { currentUser } = decoded;

        // create a new user
        const newUser = { login: currentUser, socket };
        // push to users array
        this.users.push(newUser);

        const usersCollection = MongoConnection.db.collection('users');
        usersCollection.updateOne({ login: currentUser },
          { $set: { lastConnection: 'connected' },
          });

        // set response listeners for the new user
        this.setResponseListeners(newUser);
        // send welcome message to user
        socket.emit('auth', 'you are logged in chat!');
        // console.log(`${currentUser} is connected`);
      });
    });
  }

  setResponseListeners(user) {
    user.socket.on('disconnect', () => {
      // remove the user
      _.remove(this.users, value => user.socket.id === value.socket.id);

      // check if there is no more socket connection for the user
      const isConnected = _.find(this.users, value => user.login === value.login);

      // in that case, set last connection
      if (!isConnected) {
        const usersCollection = MongoConnection.db.collection('users');
        usersCollection.updateOne({ login: user.login },
          {
            $set: { lastConnection: moment().format() },
          });
      }
    });

    user.socket.on('onlineUsers', () => {
      const onlineUsers = _.map(this.users, item => item.login);
      user.socket.emit('onlineUsers', onlineUsers);
    });

    user.socket.on('message', ({ text, target }) => {
      console.log(text, target);
        // parse the message
      if (!parserMessage(text)) return;

        // get user from DB
      const usersCollection = MongoConnection.db.collection('users');
      usersCollection.findOne({
        login: target,
        blocked: { $ne: user.login },
        matches: user.login,
      }, (err, targetUser) => {
        if (err) throw err;
        if (!targetUser) return;

        // add message to DB
        const chatCollection = MongoConnection.db.collection('chat');
        chatCollection.insertOne({ from: user.login,
          target,
          text,
          at: moment().format(),
        });

        // check if user is connected
        const socketTargets = this.users.filter(current => current.login === target);
        if (socketTargets.length) {
          const message = { from: user.login, target, text };
          socketTargets.forEach((current) => {
            current.socket.emit('message', message);
          });
        }
        // send and update user notifications
        const newNotification = `${user.login} has sent you a message.`;
        Notifications.send(this.users, newNotification, targetUser);
      });
    });
  }
}


export default ChatServer;

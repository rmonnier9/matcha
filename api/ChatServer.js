import config        		from './config/config.js';
import MongoConnection		from './config/MongoConnection.js';
import jwt						from 'jsonwebtoken';
import _							from 'lodash';
import parser					from './parser.js';
import moment					from 'moment';

// const auth = (users, socket) => async (token) => {
//
// 	// check if token is valid
// 	const decoded = await jwt.verify(token, config.secret);
// 	// if (!decoded)
//
//   const {currentUser} = decoded;
// 	const usersCollection = MongoConnection.db.collection('users');
// 	const user = await usersCollection.findOne({ 'login': currentUser });
//
//
// 	mongoConnectAsync(null, async (db) => {
// 		const log = await checkToken(data, db);
//
// 		if (!log) return (socket.emit('connect status', 'unauthorized'));
// 		db.collection('users').update(
// 			{ username: log.username },
// 			{ $set: { lastConnection: 'connected' },
// 		});
// 		users.push({ username: log.username, socket });
// 		socket.on('send message', sendMessage(db, socket, log, users));
// 		console.log(users.map((el) => el.username));
// 	});
// };


class ChatServer {
	constructor(options) {
		this.io = options.io;
		this.users = [];
	};

	init() {
		this.io.on('connection', (socket) => {
			console.log('connected');
			socket.on('auth', this.auth(socket));
		});
	};

	auth(socket) {
		return ((token) => {
			console.log('inside auth');
			console.log(token);
			jwt.verify(token, config.secret, (err, decoded) => {
				if (err) return socket.emit('auth', 'Auth error : Invalid token.');
				const {currentUser} = decoded;

				// create a new user
				const newUser = { login: currentUser, socket: socket };
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
				// send user joined message to all users
				// this.io.sockets.emit('userJoined', newUser.user);
			});
		});
	}

	setResponseListeners(user) {
		user.socket.on('disconnect', () => {
			// remove the user
			_.remove(this.users, (value) => user.socket.id == value.socket.id);

			// set last connection
			const usersCollection = MongoConnection.db.collection('users');
			usersCollection.updateOne({ login: user.login },
												{ $set: { lastConnection: moment().format('MM-DD-YYYY') },
											});
		});

		user.socket.on('onlineUsers', () => {
			const onlineUsers = _.map(this.users, (item) => {
				return item.login;
			});
			user.socket.emit('onlineUsers', onlineUsers);
		});

		user.socket.on('chat message', ({ message, target }) => {
			// console.log(target, message);
			// parse the message
		  if (!parser.message(message)) return false;

		  const socketTargets = this.users.filter((user) => user.login == target);
		//   console.log(socketTargets);
		  if (!socketTargets.length) return false;
		  const data = {from: user.login,
		  					message};
			socketTargets.forEach((user) => {
					user.socket.emit('chat message', data);
			});
			// console.log(data);
			const chatCollection = MongoConnection.db.collection('chat');
			chatCollection.insertOne({ 'from': user.login,
												'to': target,
											 	message,
												at: moment().format() });
		});
	};
}


export default ChatServer;

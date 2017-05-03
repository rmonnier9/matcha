import config        		from './config/config.js';
import MongoConnection		from './config/MongoConnection.js';
import jwt						from 'jsonwebtoken';
import _							from 'lodash';
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
				console.log(newUser);
			   usersCollection.updateOne({ login: newUser.login },
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
		// triggered when a socket disconnects
		user.socket.on('disconnect', () => {
			// remove the user
			_.remove(this.users, (value) => user.socket.id == value.socket.id);

			// set last connection
			const usersCollection = MongoConnection.db.collection('users');
			usersCollection.updateOne({ login: user.login },
												{ $set: { lastConnection: moment().format('MM-DD-YYYY') },
											});
		});
		// triggered when socket requests online users
		user.socket.on('onlineUsers', () => {
			const onlineUsers = _.map(this.users, (item) => {
				return item.login;
			});
			user.socket.emit('onlineUsers', onlineUsers);
		});

		// triggered when socket send a chat message
		user.socket.on('chat message', (chat) => {
			if (chat) user.socket.emit('chat message', chat);
		});
	}
}


export default ChatServer;

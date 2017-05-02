import config        		from './config/config.js';
import MongoConnection		from './config/MongoConnection.js';

const sendMessage = () => {

}

const auth = (users, socket) => async (token) => {

	// check if token is valid
	const decoded = await jwt.verify(token, config.secret);
	// if (!decoded)

  const {currentUser} = decoded;
	const usersCollection = MongoConnection.db.collection('users');
	const user = await usersCollection.findOne({ 'login': currentUser });


	mongoConnectAsync(null, async (db) => {
		const log = await checkToken(data, db);

		if (!log) return (socket.emit('connect status', 'unauthorized'));
		db.collection('users').update(
			{ username: log.username },
			{ $set: { lastConnection: 'connected' },
		});
		users.push({ username: log.username, socket });
		socket.on('send message', sendMessage(db, socket, log, users));
		console.log(users.map((el) => el.username));
	});
};

const SocketHandler = (socket) => {
	socket.on('auth', auth);
	socket.on('disconnect', disconnect);
}

export default SocketHandler;

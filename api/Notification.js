const send = (userSocketList, notification, user) => {
	const askedUser = userSocketList.filter((userSocket) => userSocket.login == user.login);

	// send socket notification
	if (askedUser.length) askedUser.forEach((user) => user.socket.emit('notifications', notification));

	// update user notification list in DB
	const notifications = user.notifications ? [notification, ...user.notifications] : [notification];

	// only keep the last 6 notifications
	if (notifications.length > 7) notifications.splice(6, 1);
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.update({ login: user.login }, { $set: { notifications } });
};

export { send };

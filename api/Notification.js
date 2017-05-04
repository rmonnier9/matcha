import MongoConnection  	from './config/MongoConnection.js';

const send = (userSocketList, newNotification, user) => {
	const askedUser = userSocketList.filter((userSocket) => userSocket.login == user.login);

	// send socket notification
	if (askedUser.length) askedUser.forEach((user) => user.socket.emit('notifications', newNotification));

	// update user notification list
	const userNotifications = user.notifications ? user.notifications : [];
	const alreadyNotified = userNotifications.indexOf(newNotification);
	if (alreadyNotified != -1) {
		userNotifications.splice(alreadyNotified, 1);
	}
	const notifications = userNotifications ? [newNotification, ...userNotifications] : [newNotification];
	// only keep the last 6 notifications
	if (notifications.length > 6) notifications.splice(6, 1);
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.updateOne({ login: user.login }, { $set: { notifications } });
};

export { send };

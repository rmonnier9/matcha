import MongoConnection from './config/MongoConnection.js';

const send = (userSocketList, newNotification, currentUser) => {
  const askedUser = userSocketList.filter(userSocket => userSocket.login === currentUser.login);

  // send socket notification
  if (askedUser.length) askedUser.forEach(user => user.socket.emit('notifications', newNotification));

 // save notification in db
  const notificationObj = {
    login: currentUser.login,
    content: newNotification,
    date: new Date(),
    read: false,
  };
  const notificationsCollection = MongoConnection.db.collection('notifications');
  notificationsCollection.insertOne(notificationObj);
};

const get = async (req, res) => {
  const { currentUser } = req.decoded;
  const { start } = req.query;

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' }).end();

  const toSkip = !start ? 0 : parseInt(start, 10);
  const numberPerRequest = 2;

  const notificationsCollection = MongoConnection.db.collection('notifications');
  const cursor = notificationsCollection.find({ login: currentUser })
                                        .skip(toSkip).limit(numberPerRequest);
  const notifications = await cursor.toArray();
  notificationsCollection.updateMany({ login: currentUser, read: false }, { $set: { read: true } });

  // send infos and end request
  const resObj = { success: true, message: 'Notifications found.', notifications };
  if (notifications.length) {
    const nextStart = toSkip + numberPerRequest;
    resObj.nextHref = `/notifications?start=${nextStart}`;
  }
  return res.json(resObj).end();
};

export { send, get };

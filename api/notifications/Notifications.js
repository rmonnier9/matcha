import MongoConnection from '../config/MongoConnection';

const send = (userSocketList, newNotification, currentUser) => {
  const askedUser = userSocketList.filter(userSocket => userSocket.login === currentUser.login);

  // send socket notification
  if (askedUser.length) askedUser.forEach(user => user.socket.emit('notification', newNotification));

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

  const toSkip = !start ? 0 : parseInt(start, 10);
  const numberPerRequest = 2;

  const notificationsCollection = MongoConnection.db.collection('notifications');
  const cursor = notificationsCollection.find({ login: currentUser })
                                        .sort({ date: -1 }).skip(toSkip).limit(numberPerRequest);
  const notifications = await cursor.toArray();
  notificationsCollection.updateMany({ login: currentUser, read: false }, { $set: { read: true } });

  // send infos and end request
  const resObj = { error: '', notifications };
  if (notifications.length) {
    const nextStart = toSkip + numberPerRequest;
    resObj.nextHref = `/notifications?start=${nextStart}`;
  }
  return res.send(resObj);
};

const getUnreadNumber = async (req, res) => {
  const { currentUser } = req.decoded;

  const notificationsCollection = MongoConnection.db.collection('notifications');
  const cursor = notificationsCollection.aggregate([
        { $match: { login: currentUser, read: false } },
        { $group: { _id: null, count: { $sum: 1 } } },
  ]);

  const result = await cursor.next();
  const count = !result ? 0 : result.count;

  // send infos and end request
  return res.send({ error: '', count });
};

export { send, get, getUnreadNumber };

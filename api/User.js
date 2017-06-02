import _ from 'lodash';
import MongoConnection from './config/MongoConnection.js';
import parser from './parser.js';
import * as UsersTools from './UsersTools.js';
import * as Notification from './Notifications.js';

const getInfos = users => async (req, res) => {
  const { currentUser } = req.decoded;
  const { login } = req.params;

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login, blocked: { $ne: currentUser } });
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' }).end();

  if (currentUser !== login) {
    const alreadyVisited = _.find(user.visitedBy, visitor => visitor === currentUser);

    // if first visit
    if (!alreadyVisited) {
      // record visit in database
      usersCollection.updateOne({ login }, {
        $inc: { visits: 1 },
        $push: { visitedBy: currentUser },
      });

      // send and update user notifications
      const newNotification = `${currentUser} has taken a look at your profile.`;
      Notification.send(users, newNotification, user);
    }
  }
  // get and send infos then end request
  const currentUserData = await usersCollection.findOne({ login: currentUser });
  const profile = UsersTools.getInfos(user, currentUserData);
  return res.json({ success: true, message: 'Profile found.', profile }).end();
};

const getMyInfos = async (req, res) => {
  const { currentUser } = req.decoded;
  // console.log(req);

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  if (!user) return res.status(404).json({ success: false, message: 'Profile not found.' }).end();

  // get and send infos then end request
  const profile = UsersTools.getPrivateInfos(user);
  return res.json({ success: true, message: 'Profile found.', profile }).end();
};

const updateInfo = async (req, res) => {
  const { currentUser } = req.decoded;
  const { body } = req;

  // parse the form fields
  const error = parser.updateForm(body);
  if (error != null) return res.json({ success: false, error }).end();

  // filter parameters that can be updated with a whitelist
  const whitelist = ['firstname', 'lastname', 'gender', 'birthDate', 'about', 'tags', 'profilePictureId', 'location'];
  const update = {};
  for (const ix in whitelist) {
    if ({}.hasOwnProperty.call(whitelist, ix)) {
      const field = whitelist[ix];
      if ({}.hasOwnProperty.call(body, field) && body[field]) {
        update[field] = body[field];
      }
    }
  }
  if ({}.hasOwnProperty.call(body, 'lookingFor') && body.lookingFor) update.lookingFor = body.lookingFor === 'both' ? ['male', 'female'] : [body.lookingFor];

  // update user in DB
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.updateOne({ login: currentUser }, { $set: update });
  return res.json({ success: true, message: 'Profile successfully updated.' }).end();
};

export { getInfos, getMyInfos, updateInfo };

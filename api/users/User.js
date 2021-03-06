const _ = require('lodash');
const MongoConnection = require('../MongoConnection');
const parser = require('./parser');
const UsersTools = require('./UsersTools');
const Notification = require('../notifications/Notifications');
const mail = require('./mail');

const getInfos = users => async (req, res) => {
  const { currentUser } = req.decoded;
  const { login } = req.params;

  // get user from DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login, blocked: { $ne: currentUser } });
  if (!user) return res.json({ error: 'Profile not found.' }).end();

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
  return res.json({ error: '', profile }).end();
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
  return res.json({ error: '', profile }).end();
};

const changeEmail = (update, email, login) => {
  const activationString = UsersTools.randomString(16);

  update.newEmail = email;
  update.activationString = activationString;

  // send mail to the user and end the request
  const subject = 'Matcha - Email update';
  const content = `To confirm your email update, please check : /confirm?login=${login}&activation=${activationString}`;
  mail(email, subject, content);
  return (update);
};

const updateInfo = async (req, res) => {
  const { currentUser } = req.decoded;
  const { body } = req;

  // parse the form fields
  const error = parser.updateForm(body);
  if (error != null) return res.json({ error }).end();

  // filter parameters that can be updated with a whitelist
  const whitelist = [
    'firstname', 'lastname', 'gender', 'birthDate', 'tags',
    'about',
  ];
  let update = {};
  whitelist.forEach((field) => {
    if (body[field]) { update[field] = body[field]; }
  });
  if (body.lookingFor) {
    update.lookingFor = body.lookingFor === 'both' ? ['male', 'female'] : [body.lookingFor];
  }
  if (body.birthDate) {
    update.birthDate = new Date(body.birthDate);
  }
  if (body.latitude && body.longitude) {
    const lat = parseFloat(body.latitude);
    const lng = parseFloat(body.longitude);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      update.loc = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    }
  }
  if (body.profilePictureId) {
    const id = parseInt(body.profilePictureId, 10);
    if (id >= 0 && id <= 4) {
      update.profilePictureId = id;
    }
  }
  if (body.email) {
    update = changeEmail(update, body.email, currentUser);
  }
  // update user in DB
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.updateOne({ login: currentUser }, { $set: update });
  return res.json({ error: '' }).end();
};

module.exports = { getInfos, getMyInfos, updateInfo };

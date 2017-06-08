import jwt from 'jsonwebtoken';

import IPGeolocation from './IPGeolocation.js';
import config from './config/config.js';
import MongoConnection from './config/MongoConnection.js';
import * as UsersTools from './UsersTools.js';
import parser from './parser.js';
import mail from './mail.js';

const signup = async (req, res) => {
  const { email, firstname, lastname, login, password } = req.body;

  // parse the form fields
  const error = parser.signupForm(req.body);
  if (error != null) return res.json({ success: false, error }).end();

  // check if the login already exists
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login });
  if (user) return res.json({ success: false, error: [{ field: 'login', message: 'That login is already taken.' }] }).end();

  const { ip } = req;
  const location = await IPGeolocation(ip);

  // create user obj
  const activationString = UsersTools.randomString(16);
  const newUser = UsersTools.create(email, firstname, lastname, login, password,
    activationString, location);

  // add user to DB
  usersCollection.insertOne(newUser);

  // send mail to the user and end the request
  const subject = 'Matcha - Account created !';
  const content = `Welcome to Matcha. Your activation key is : ${activationString}`;
  mail(email, subject, content);
  return res.json({ success: true, message: 'Account successfully created.' }).end();
};

const emailConfirm = async (req, res) => {
  const { login, activation } = req.body;

  // find user in DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login });
  if (!user) return res.json({ error: 'User not found.' }).end();

  const update = { $set: { active: true }, $unset: { activationString: '', newEmail: '' } };

  // check if account already activated
  if (user.newEmail) {
    update.$set = { email: user.newEmail };
  } else if (user.active === true) {
    return res.json({ error: 'Account already activated.' }).end();
  }

  // check if activation key is valid
  if (!activation) {
    return res.json({ error: 'No activation key.' }).end();
  }
  if (user.activationString !== activation) {
    return res.json({ error: 'Wrong activation key.' }).end();
  }

  // update the user in DB and end the request
  usersCollection.updateOne({ login }, update);
  return res.json({ error: '' }).end();
};

const signin = async (req, res) => {
  const { login, password } = req.body;

  // find user in DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login });
  if (!user) return res.json({ success: false, message: 'Authentication failed : user not found.' }).end();

  // check if password is valid
  if (!UsersTools.validPassword(password, user.password)) {
    return res.json({ success: false, message: 'Authentication failed : wrong password.' }).end();
  }

  if (!user.active) {
    return res.json({ success: false, message: 'Please activate your account. Check your email' }).end();
  }

  // create a session token for 2 hours, send it then end the request
  const token = jwt.sign({ currentUser: user.login },
    config.secret, { expiresIn: 3600 * 24 * 300 });
  // res.set('Access-Control-Expose-Headers', 'x-access-token');
  // res.set('x-access-token', token);
  return res.json({ success: true, message: 'Token delivered.', token }).end();
};

const forgotPassword = async (req, res) => {
  const { login, email } = req.body;

  // find the user in DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login });
  if (!user || user.email !== email) {
    return res.json({ error: 'Wrong login/email association.' }).end();
  }

  // generate new random password
  const newPassword = UsersTools.randomString(12);

  // hash the password
  const hashedPassword = UsersTools.generateHash(newPassword);

  // save the new password in DB
  const update = { password: hashedPassword };
  usersCollection.updateOne({ login }, { $set: update });

  // find the user in DB to get email

  // send mail with password and then end the request
  const subject = 'Forgot password - New password';
  const content = `Your new password is ${newPassword}`;
  mail(email, subject, content);
  return res.json({ error: '' });
};

const isLogged = (req, res, next) => {
  // get the token from post, get or x-access-token http header field
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });

  // check if token is valid
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.json({ success: false, message: 'Failed to authenticate token.' });

    // save token datas into req.decoded and then call next request
    req.decoded = decoded;
    return next();
  });
};

const whoami = (req, res) => {
  const { currentUser } = req.decoded;

  // send the login and end request
  return res.json({ success: true, message: `Authenticated as ${currentUser}` }).end();
};

const updatePassword = async (req, res) => {
  const { currentUser } = req.decoded;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  // find user in DB
  const usersCollection = MongoConnection.db.collection('users');
  const user = await usersCollection.findOne({ login: currentUser });
  if (!user) return res.json({ error: 'User not found.' }).end();

  if (!UsersTools.validPassword(oldPassword, user.password)) {
    return res.json({ error: 'Wrong old password.' }).end();
  }

  // parse the form fields
  const error = parser.passwordField(newPassword, confirmNewPassword);
  if (error != null) return res.json({ error });

  // hash the password
  const hashedPassword = UsersTools.generateHash(newPassword);

  // save the new password in DB and then end the request
  const update = { password: hashedPassword };
  usersCollection.updateOne({ login: currentUser }, { $set: update });
  return res.json({ error: '' });
};

export { signup, signin, isLogged, whoami, updatePassword, forgotPassword, emailConfirm };

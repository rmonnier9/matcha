import jwt						from 'jsonwebtoken'

import config        		from './config/config.js'
import MongoConnection		from './config/MongoConnection.js'
import * as UsersTools		from './UsersTools.js'
import parser					from './parser.js'
import mail						from './mail.js'

const signup = async (req, res, next) => {
	const {email, firstname, lastname, login, password, confirmpassword} = req.body

	// parse the form fields
	const error = parser.signupForm(req.body)
	if (error != null) return res.json({ success: false, error }).end()

	// check if the login already exists
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({ login:  login })
	if (user) return res.json({ success: false, error: {field: "login", message: "That login is already taken."} }).end()

	const {ip} = req
	console.log("IP is ", ip);



	// create user obj
	const activationString = UsersTools.randomString(16)
	const newUser = UsersTools.create(email, login, password, activationString)

	// add user to DB
	const r = await usersCollection.insertOne(newUser)

	// send mail to the user and end the request
	const subject = "Matcha - Account created !";
	const content = "Welcome to Matcha. Your activation key is : " + activationString
   mail(email, subject, content);
   return res.json({ success: true, message: 'Account successfully created.' }).end()
}

const emailConfirm = async (req, res) => {
	const {login, activation} = req.body

	// find user in DB
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({ 'login':  login })
   if (!user) return res.json({ success: false, message: 'User not found.' }).end()

	// check if account already activated
	if (user.active == true)
		return res.json({ success: false, message: 'Account already activated.' }).end()

	// check if activation key is valid
	if (user.activationString != activation)
		return res.json({ success: false, message: 'Wrong activation key.' }).end()

	// update the user in DB and end the request
	const r = await usersCollection.updateOne({ 'login':  login }, {active: true, $unset: {activationString: ""}})
	return res.json({ success: true, message: 'Account successfully activated.' }).end()
}

const signin = async (req, res, next) => {
  const {login, password} = req.body

	// find user in DB
  	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({ 'login':  login })
   if (!user) return res.json({ success: false, message: 'Authentication failed : user not found.' }).end()

	// check if password is valid
   if (!UsersTools.validPassword(password, user.password))
		return res.json({ success: false, message: 'Authentication failed : wrong password.' }).end();

	if (!user.active)
		return res.json({ success: false, message: 'Please activate your account. Check your email' }).end();

	// create a session token for 2 hours, send it then end the request
   const token = jwt.sign({currentUser: user.login}, config.secret, { expiresIn: 3600 * 2 });
// 	res.set('Access-Control-Expose-Headers', 'x-access-token');
// res.set('x-access-token', token);
   return res.json({ success: true, message: 'Token delivered.', token: token }).end();
}

const isLogged = (req, res, next) => {
	//get the token from post, get or x-access-token http header field
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(401).json({success: false, message: 'No token provided.'});

	// check if token is valid
  jwt.verify(token, config.secret, (err, decoded) => {
	  if (err) return res.json({ success: false, message: 'Failed to authenticate token.' });

	 // save token datas into req.decoded and then call next request
	 req.decoded = decoded;
	 next();
  })
}

const whoami = (req, res) => {
  	const {currentUser} = req.decoded

	// send the login and end request
	return res.json({success: true, message: 'Authenticated as ' + currentUser}).end();
}

const updatePassword = async (req, res) => {
	const {currentUser} = req.decoded;
	const {password, confirmpassword} = req.body;

	// parse the form fields
	const error = parser.passwordField(password, confirmpassword);
	if (error != null) return res.json({ success: false, error })

	// hash the password
	const hashedPassword = User.generateHash(password);

	// save the new password in DB and then end the request
	const update = {password: hashedPassword};
	const usersCollection = MongoConnection.db.collection('users');
	const r = await usersCollection.updateOne({login: currentUser}, {$set: update});
	res.json({success: true, message: 'Password successfully updated.'});
}

const forgotPassword = async (req, res) => {
	const {currentUser} = req.decoded;

	// generate new random password
	const newPassword = User.randomString(12);

	// hash the password
	const hashedPassword = User.generateHash(newPassword);

	// save the new password in DB
	const update = {password: hashedPassword};
	const usersCollection = MongoConnection.db.collection('users');
	const r = await usersCollection.updateOne({login: currentUser}, {$set: update});

	// find the user in DB to get email
	const user = await usersCollection.findOne({ 'login':  login });
	const {email} = user;

	//send mail with password and then end the request
	const subject = "Forgot password - Your new password";
	const content = "Your new password is " + newPassword;
	mail(email, subject, content);
	return res.json({success: true, message: 'New password generated. Check your email.'});
}

export {signup, signin, isLogged, whoami, updatePassword, forgotPassword, emailConfirm}

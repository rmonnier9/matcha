import config        		from './config/config.js';
import MongoConnection		from './config/MongoConnection.js';
import User			      	from './class/User.class.js'
import jwt						from 'jsonwebtoken';
import parser					from './parser.js';
import mail						from './mail.js';

const signup = (req, res, next) => {
	const {login, email, password, confirmpassword} = req.body;

	// parse the form fields
  const error = parser.signupForm(req.body);
  if (error != null) return res.json({ success: false, error }).end();

	// check if the login already exists
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.findOne({ 'login':  login }, (err, user) => {
    if (err) throw err;
    if (user) return res.json({ success: false, error: {field: "login", message: "That login is already taken."} }).end();

	 // create user obj
	 const activationString = User.randomString(16);
    const newUser = User.create(email, login, password, activationString);

	 // add user to DB
    usersCollection.insertOne(newUser, (err, r) => {
      if (err) throw err;

		// send mail to the user and end the request
		const subject = "Matcha - Account created !";
		const content = "Welcome to Matcha.";
      mail(email, subject, content);
      return res.json({ success: true, message: 'Account successfully created.' }).end();
   })
 })
}

const emailConfirm = (req, res) => {
	const {login, activation} = req.query;

	// find user in DB
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({ 'login':  login }, (err, user) => {
		if (err) throw err;
	   if (!user) return res.json({ success: false, message: 'User not found.' }).end();

		// check if account already activated
		if (user.active == true)
			return res.json({ success: false, message: 'Account already activated.' }).end();

		// check if activation key is valid
		if (user.activationString != activation)
			return res.json({ success: false, message: 'Wrong activation key.' }).end();

		// update the user in DB and end the request
		usersCollection.updateOne({ 'login':  login }, {active: true, $unset: {activationString: ""}}, (err, r) => {
			if (err) throw err;
			return res.json({ success: true, message: 'Account successfully activated.' }).end();
		});
	})
}

const signin = (req, res, next) => {
  const {login, password} = req.body;

	// find user in DB
  	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({ 'login':  login }, (err, user) => {
	   if (err) throw err;
	   if (!user) return res.json({ success: false, message: 'Authentication failed : user not found.' }).end();

		// check if password is valid
	   if (!User.validPassword(password, user.password))
			return res.json({ success: false, message: 'Authentication failed : wrong password.' }).end();

		// create a session token for 2 hours, send it then end the request
	   const token = jwt.sign({currentUser: user.login}, config.secret, { expiresIn: 3600 * 2 });
	   return res.json({ success: true, message: 'Token delivered.', token: token }).end();
	})
}

const isLogged = (req, res, next) => {
	//get the token from post, get or x-access-token http header field
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(401).json({success: false, error: 'No token provided.'});

	// check if token is valid
  jwt.verify(token, config.secret, (err, decoded) => {
	  if (err) return res.json({ success: false, error: 'Failed to authenticate token.' });

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

const updatePassword = (req, res) => {
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
	usersCollection.updateOne({login: currentUser}, {$set: update}, (err, r) => {
		if (err) throw err;
		res.json({success: true, message: 'Password successfully updated.'});
	});
}

const forgotPassword = (req, res) => {
	const {currentUser} = req.decoded;

	// generate new random password
	const newPassword = User.randomString(8);

	// hash the password
	const hashedPassword = User.generateHash(newPassword);

	// save the new password in DB
	const update = {password: hashedPassword};
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.updateOne({login: currentUser}, {$set: update}, (err, r) => {
		if (err) throw err;

		// find the user in DB to get email
		usersCollection.findOne({ 'login':  login }, (err, user) => {
			if (err) throw err;
			const email = user.email;

			//send mail with password and then end the request
			const subject = "Forgot password - Your new password";
			const content = "Your new password is " + newPassword;
			mail(email, subject, content);
			return res.json({success: true, message: 'New password generated. Check your email.'});
		});
	});
}

export {signup, signin, isLogged, whoami, updatePassword, emailConfirm}

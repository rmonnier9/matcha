import config        		from './config/config.js';
import MongoConnection		from './config/MongoConnection.js';
import User			      	from './class/User.class.js'
import jwt						from 'jsonwebtoken';
import parser					from './parser.js';
import mail						from './mail.js'

const signup = (req, res, next) => {

	// get and parse the form fields
  const {login, email, password, confirmpassword} = req.body
  const error = parser.signupForm(req.body);
  if (error != null) return res.json({ success: false, error })

	// check if the login already exists
  const usersCollection = MongoConnection.db.collection('users');
  usersCollection.findOne({ 'login':  login }, (err, user) => {
    if (err) throw err
    if (user) return res.json({ success: false, error: {field: "login", message: "That login is already taken."} })

	 // create json user and add it to DB
	 const activationString = User.randomString(16);
    const newUser = User.create(email, login, password, activationString);
    usersCollection.insertOne(newUser, (err, r) => {
      if (err) throw err

		// send mail to the user and end the request
      mail(email, "Matcha - Account created !", "Welcome to Matcha.");
      return res.json({ success: true, message: 'Account successfully created.' }).end()
   })
 })
}

const emailConfirm = (req, res) => {
	const {login, activation} = req.query;

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({ 'login':  login }, (err, user) => {
		if (user.active == true)
			return res.json({ success: false, message: 'Account already activated.' }).end();
		if (user.activationString == activation) {
			usersCollection.updateOne({ 'login':  login }, {active: true, $unset: {activationString: ""}});
			return res.json({ success: true, message: 'Account successfully activated.' }).end();
		}
		else
			return res.json({ success: false, message: 'Wrong activation string.' }).end();
	})
}

const signin = (req, res, next) => {

	// get the form fields
  const {login, password} = req.body;

	// get the user datas from the DB
  	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({ 'login':  login }, (err, user) => {
	   if (err) throw err;
	   if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' });
	   if (!User.validPassword(password, user.password)) return res.json({ success: false, message: 'Authentication failed. Wrong password.' });

		// create a session token for 2 hours, send it then end the request
	   const token = jwt.sign({currentUser: user.login}, config.secret, { expiresIn: 3600 * 2 });
	   return res.json({ success: true, message: 'Token delivered.', token: token }).end();
	})
}

const isLogged = (req, res, next) => {
	//get the token from post, get or x-access-token http header field
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

	// check the token
  if (!token) return res.status(401).json({success: false, error: 'No token provided.'});
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.json({ success: false, error: 'Failed to authenticate token.' });

	 // if token is valid, save token datas into req.decoded and then call next request
		req.decoded = decoded;
		next();
  })
}

const whoami = (req, res) => {

	// get token datas
  	const {currentUser} = req.decoded

	// send the login and end request
	return res.json({success: true, message: 'Authenticated as ' + currentUser}).end();
}

const updatePassword = (req, res) => {

	const {currentUser} = req.decoded;

	// get and parse the form fields
	const {password, confirmpassword} = req.body;
	const error = parser.passwordField(password, confirmpassword);
	if (error != null) return res.json({ success: false, error })

	// hash the password and add it to json update
	const hashedPassword = User.generateHash(password);
	const update = {password: hashedPassword};

	// save the new password in DB
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.updateOne({login: currentUser}, {$set: update}, (err, r) => {
		if (err) throw err;
		// console.log('The raw response from Mongo was ', raw);
		res.json({success: true, message: 'Password successfully updated.'});
	});
}

export {signup, signin, isLogged, whoami, updatePassword, emailConfirm}

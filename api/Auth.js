import config        from './config/config.js';
import MongoConnection	from './config/MongoConnection.js';
import bcrypt   from 'bcrypt-nodejs';
import jwt            from 'jsonwebtoken';
import parser from './parser.js';
import mail from './mail.js'

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

const signup = (req, res, next) => {

  const {login, email, password, confirmpassword} = req.body
  const error = parser.signupForm(req.body);
  if (error != null) return res.json({ success: false, error })

  const col = MongoConnection.db.collection('users');
  col.findOne({ 'login':  login }, (err, user) => {
    if (err) throw err
    if (user) return res.json({ success: false, error: {field: "login", message: "That login is already taken."} })

    const newUser = {}
    newUser.email = email
    newUser.login = login
    newUser.pictures = []
    newUser.password = generateHash(password)
    col.insertOne(newUser, (err, r) => {
      if (err) throw err
      mail(email, "Matcha - Account created !", "Welcome to Matcha.");
      return res.json({ success: true, message: 'Account successfully created.' })
   })
 })
}

const signin = (req, res, next) => {
  const {login, password} = req.body
	MongoConnection.db.collection('users').findOne({ 'login':  login }, (err, user) => {
	   if (err) throw err
	   if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' })
	   if (!validPassword(password, user.password)) return res.json({ success: false, message: 'Authentication failed. Wrong password.' })
	   const token = jwt.sign({currentUser: user.login}, config.secret, { expiresIn: 3600 * 24 })
	   return res.json({ success: true, message: 'Token delivered.', token: token })
	})
}

const isLogged = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (!token) return res.status(401).json({success: false, error: 'No token provided.'});
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.json({ success: false, error: 'Failed to authenticate token.' });
		req.decoded = decoded;
		next();
  })
}

const whoami = (req, res) => {
  	const {currentUser} = req.decoded
  	console.log(req.decoded);
    if (!currentUser) return res.json({success: true, message: 'Not authenticated.'})
  	else return res.json({success: true, message: 'Authenticated as ' + currentUser})
}

const updatePassword = (req, res) => {
	const {currentUser} = req.decoded;
	const {password, confirmpassword} = req.body;

  const error = parser.passwordField(password, confirmpassword);
  if (error != null) return res.json({ success: false, error })

	const hashedPassword = generateHash(password);
	const update = {password: hashedPassword};
	MongoConnection.db.collection('users').updateOne({login: currentUser}, {$set: update}, (err, r) => {
		if (err) throw err;
		// console.log('The raw response from Mongo was ', raw);
		res.json({success: true, message: 'Password successfully updated.'});
	});
}

export {signup, signin, isLogged, whoami, updatePassword}

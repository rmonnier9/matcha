import config        from './config/config.js'
import MongoConnection	from './config/MongoConnection.js'
import bcrypt   from 'bcrypt-nodejs'
import jwt            from 'jsonwebtoken'

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

const signup = (req, res, next) => {

  const {login, email, password, confirmpassword} = req.body
 const col = MongoConnection.db.collection('users');
 col.findOne({ 'login':  login }, (err, user) => {
   if (err) throw err
   if (user) return res.json({ success: false, message: 'That login is already taken.' })

   if (password != confirmpassword)  return res.json({ success: false, message: 'Passwords are different.' })
   const newUser = {}
   newUser.email = email
   newUser.login = login
   newUser.pictures = []
   newUser.password = generateHash(password)
   col.insertOne(newUser, (err, r) => {
     if (err) throw err
     return res.json({ success: true, message: 'Account successfully created.' })
     db.close()
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
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) return res.status(401).send({success: false, message: 'No token provided.'}).end()
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.json({ success: false, message: 'Failed to authenticate token.' }).end()
		req.decoded = decoded
		next()
  })
}

const whoami = (req, res) => {
  	const {currentUser} = req.decoded
  	console.log(req.decoded);
    if (!currentUser) return res.json({success: true, message: 'Not authenticated.'}).end()
  	else return res.json({success: true, message: 'Authenticated as ' + currentUser}).end()
}

const updatePassword = (req, res) => {
	const {currentUser} = req.decoded;
	const {password, confirmpassword} = req.body;

	if (password != confirmpassword) res.json({ success: false, message: 'Passwords are differents.' }).end();

	const hashedPassword = generateHash(password);
	const update = {password: hashedPassword};
	MongoConnection.db.collection('users').updateOne({ login: login }, {$set: update}, (err, r) => {
		if (err) throw err;
		// console.log('The raw response from Mongo was ', raw);
		res.json({success: true, message: 'Password successfully updated.'});
	});
}

export {signup, signin, isLogged, whoami, updatePassword}

import mongoConnect from './config/mongo.js'
import bcrypt   from 'bcrypt-nodejs'
import jwt            from 'jsonwebtoken'
import config        from './config/config.js'

const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

const signupController = (req, res, next) => {

  const {login, email, password, confirmpassword} = req.body
  mongoConnect( db => {
    const col = db.collection('users')
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
  })
}

const signinController = (req, res, next) => {
  const {login, password} = req.body
  mongoConnect( db => {
    db.collection('users').findOne({ 'login':  login }, (err, user) => {
      if (err) throw err
      if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' })
      if (!validPassword(password, user.password)) return res.json({ success: false, message: 'Authentication failed. Wrong password.' })
      const token = jwt.sign({currentUser: user.login}, config.secret, { expiresIn: 3600 * 24 })
      return res.json({ success: true, message: 'Token delivered.', token: token })
    })
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

export {signupController, signinController, isLogged, whoami}

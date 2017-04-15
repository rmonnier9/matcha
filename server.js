import express from 'express'
const app           = express()
const port          = 8000

import mongoose      from 'mongoose'
import passport      from 'passport'
import flash         from 'connect-flash'

import morgan      	from 'morgan'
import cookieParser	from 'cookie-parser'
import bodyParser   	from 'body-parser'
import session      	from 'express-session'
import fileUpload	 	from 'express-fileupload'
import path				from 'path'

import configDB     	from './config/database.js'
const	mongoStore	  = require('connect-mongo')(session)

// configuration ===============================================================
mongoose.connect(configDB.url) // connect to our database

require('./config/passport')(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser()) // get information from html forms
app.use(fileUpload()) //get uploaded files
app.use(express.static(path.join(__dirname, 'dist'), {
  dotfiles: 'ignore',
  index: false
}))

app.set('view engine', 'ejs')

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch',
 						store: new mongoStore({ mongooseConnection: mongoose.connection })
					}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

// routes ======================================================================
// require('./app/routes.js')(app, passport) // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
app.listen(port)
console.log('The magic happens on port ' + port)

/*
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // render a regular page
  res.send('regular')
})

// handler for the /user/:id path, which renders a special page
app.get('/user/:id', function (req, res, next) {
  res.send('special')
})

app.get('/', function(req, res) {
    res.render('login');
});

app.get('/login/:etagenum', function(req, res) {
    const noms = ['Robert', 'Jacques', 'David'];
    res.render('index', {etage: req.params.etagenum, noms: noms});
});
*/

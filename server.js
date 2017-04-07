const express       = require('express');
const app           = express();
const port          = 8000;
const mongoose      = require('mongoose');
const passport      = require('passport');
const flash         = require('connect-flash');

const morgan        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const fileUpload	  = require('express-fileupload');

const configDB      = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(fileUpload()); //get uploaded files
app.use(express.static('dist'));

app.set('view engine', 'ejs')

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

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

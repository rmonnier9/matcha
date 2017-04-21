// app/routes.js
import fs 			from 'fs'
import uuid			from 'uuid'
import path			from 'path'
import mongoConnect from './config/mongo.js'
import * as Auth from './Auth.js'
import * as User from './User.js'

const routes = (apiRoutes, app) => {

// User authentification  ==========
apiRoutes.post('/signup', Auth.signupController)
apiRoutes.post('/signin', Auth.signinController)

// Logged part  ====================
apiRoutes.use(Auth.isLogged)
apiRoutes.get('/whoami', Auth.whoami)

// User authentification  ==========

apiRoutes.get('/profile/:login', User.getInfo)

apiRoutes.post('/profile/:login', User.updateInfo)

apiRoutes.get('/profile/:login/pictures/:id', User.getPicture)

apiRoutes.post('/profile/:login/pictures', User.postPicture)

}


// route middleware to make sure a user is logged in
const isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
	return next();
	res.redirect('/');
}

export default routes

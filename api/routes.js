// app/routes.js
import * as Auth from './Auth.js'
import * as User from './User.js'

const routes = (apiRoutes) => {

// User authentification  ==========
apiRoutes.post('/signup', Auth.signupController)
apiRoutes.post('/signin', Auth.signinController)

// Logged part  ====================
apiRoutes.use(Auth.isLogged)
apiRoutes.get('/whoami', Auth.whoami)

// User Datas  ==========
apiRoutes.get('/profile/:login', User.getInfo)
apiRoutes.post('/profile/:login', User.updateInfo)
apiRoutes.get('/profile/:login/pictures/:id', User.getPicture)
apiRoutes.post('/profile/:login/pictures', User.postPicture)

}

export default routes

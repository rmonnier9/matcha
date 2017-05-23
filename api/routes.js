import * as Auth from './Auth.js'
import * as User from './User.js'
import * as Interaction from './Interaction.js'
import * as Search from './Search.js'
import * as Chat from './Chat.js'
import * as Suggestions from './Suggestions.js'

function rejectedCatcher(handler) {
  return function(req, res, next) {
    handler(req, res, next).catch(error => {next(error);})
  };
}

const routes = (app, users) => {
console.log(Auth)
console.log(User)
console.log(Interaction)

// User authentification  ==========
app.post('/api/signup', rejectedCatcher(Auth.signup))
app.post('/api/signin', Auth.signin)
app.post('/api/confirm', Auth.emailConfirm)

// Logged part  ====================
app.use('/api', Auth.isLogged)
app.get('/api/whoami', Auth.whoami)

// Password  ============
app.post('/api/update_password', Auth.updatePassword)
app.get('/api/forgot_password', Auth.forgotPassword)

// User Datas  ==========
app.get('/api/profile/:login', User.getInfo(users)) //block report and like also
app.get('/api/myprofile', User.getMyInfo) //block report and like also
app.post('/api/myprofile', rejectedCatcher(User.updateInfo))
// app.delete('/api/profile/:login', User.deleteProfile);
// app.get('/api/profile/:login/notifications', User.notifications);

// Images  ==============
app.get('/api/pictures/:login/:id', User.getPicture)
app.post('/api/myprofile/pictures', User.postPicture)
// app.delete('/api/profile/:login/pictures/:id', User.deletePicture);

// Likes  ===============
app.get('/api/likes/:target', Interaction.getInterest)
app.post('/api/likes/:target', Interaction.updateInterest(users))

// Report and block  ====
app.post('/api/reports/:target', Interaction.reportUser, Interaction.updateBlock)
app.get('/api/blocks/:target', Interaction.getBlockStatus)
app.post('/api/blocks/:target', Interaction.updateBlock)

// chat  ===============
app.get('/api/chat/:target', rejectedCatcher(Chat.getMessages))

// notifications  ===============
app.get('/api/notifications', rejectedCatcher(User.getNotifications))

// notifications  ===============
app.get('/api/suggestions', rejectedCatcher(Suggestions.getSuggestions))

// search  ===============
app.get('/api/search', rejectedCatcher(Search.advancedSearch))

// Suggestion  ===========
// app.get('/api/suggestions', suggestion);

}

export default routes;

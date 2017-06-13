import * as Auth from './users/Auth';
import * as User from './users/User';
import * as Pictures from './users/Pictures';
import * as Interactions from './users/Interactions';
import * as Search from './users/Search';
import * as Suggestions from './users/Suggestions';
import * as Matches from './users/Matches';
import * as Likes from './users/Likes';
import * as Visits from './users/Visits';
import * as Chat from './chat/Chat';
import * as Notifications from './notifications/Notifications';

const rejectedCatcher = handler => (req, res, next) => {
  handler(req, res, next).catch((error) => { next(error); });
};

const routes = (app, users, upload) => {
  // console.log(Auth);
  // console.log(User);
  // console.log(Interactions);

  // User authentification  ==========
  app.post('/api/signup', rejectedCatcher(Auth.signup))
  .post('/api/signin', Auth.signin)
  .post('/api/confirm', Auth.emailConfirm)
  .post('/api/forgot_password', Auth.forgotPassword)

  // Logged part  ====================
  .use('/api', Auth.isLogged)
  .get('/api/whoami', Auth.whoami)

  // Password  ============
  .post('/api/update_password', Auth.updatePassword)

  // User Datas  ==========
  .get('/api/profile/:login', User.getInfos(users)) // block report and like also
  .get('/api/myprofile', User.getMyInfos) // block report and like also
  .post('/api/myprofile', rejectedCatcher(User.updateInfo))
  // app.delete('/api/profile/:login', User.deleteProfile)
  // app.get('/api/profile/:login/notifications', User.notifications)

  // Images  ==============
  .get('/api/pictures/:login/:id', Pictures.get)
  .post('/api/myprofile/pictures', Pictures.saveCheck, upload.single('imageUploaded'), Pictures.save)
  .delete('/api/myprofile/pictures/:id', Pictures.remove)
  .get('/api/myprofile/pictures/:id', Pictures.setAsProfile)

  // Likes  ===============
  .get('/api/likes/:target', Interactions.getInterest)
  .post('/api/likes/:target', Interactions.updateInterest(users))

  // Report and block  ====
  .post('/api/reports/:target', Interactions.reportUser, Interactions.updateBlock)
  .get('/api/blocks/:target', Interactions.getBlockStatus)
  .post('/api/blocks/:target', Interactions.updateBlock)

  // chat  ===============
  .get('/api/chat/:target', rejectedCatcher(Chat.getMessages))

  // Notifications  ===============
  .get('/api/notifications', rejectedCatcher(Notifications.get))
  .get('/api/unreadnotifications', rejectedCatcher(Notifications.getUnreadNumber))

  // Matches  ===============
  .get('/api/myprofile/matches', rejectedCatcher(Matches.get))
  .get('/api/myprofile/visits', rejectedCatcher(Visits.get))
  .get('/api/myprofile/likes', rejectedCatcher(Likes.get))

  // Suggestions ===============
  .get('/api/suggestions', rejectedCatcher(Suggestions.get))

  // Search  ===============
  .get('/api/search', rejectedCatcher(Search.advancedSearch));
};

export default routes;

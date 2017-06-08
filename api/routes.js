import * as Auth from './Auth.js';
import * as User from './User.js';
import * as Pictures from './Pictures.js';
import * as Interactions from './Interactions.js';
import * as Search from './Search.js';
import * as Chat from './Chat.js';
import * as Suggestions from './Suggestions.js';
import * as Notifications from './Notifications.js';
import * as Matches from './Matches.js';
import * as Likes from './Likes.js';
import * as Visits from './Visits.js';

const rejectedCatcher = handler => (req, res, next) => {
  handler(req, res, next).catch((error) => { next(error); });
};

const routes = (app, users, upload) => {
  // console.log(Auth);
  // console.log(User);
  // console.log(Interactions);

  // User authentification  ==========
  app.post('/api/signup', rejectedCatcher(Auth.signup));
  app.post('/api/signin', Auth.signin);
  app.post('/api/confirm', Auth.emailConfirm);
  app.post('/api/forgot_password', Auth.forgotPassword);

  // Logged part  ====================
  app.use('/api', Auth.isLogged);
  app.get('/api/whoami', Auth.whoami);

  // Password  ============
  app.post('/api/update_password', Auth.updatePassword);

  // User Datas  ==========
  app.get('/api/profile/:login', User.getInfos(users)); // block report and like also
  app.get('/api/myprofile', User.getMyInfos); // block report and like also
  app.post('/api/myprofile', rejectedCatcher(User.updateInfo));
  // app.delete('/api/profile/:login', User.deleteProfile)
  // app.get('/api/profile/:login/notifications', User.notifications)

  // Images  ==============
  app.get('/api/pictures/:login/:id', Pictures.get);
  app.post('/api/myprofile/pictures', Pictures.saveCheck, upload.single('imageUploaded'), Pictures.save);
  app.delete('/api/myprofile/pictures/:id', Pictures.remove);
  app.get('/api/myprofile/pictures/:id', Pictures.setAsProfile);

  // Likes  ===============
  app.get('/api/likes/:target', Interactions.getInterest);
  app.post('/api/likes/:target', Interactions.updateInterest(users));

  // Report and block  ====
  app.post('/api/reports/:target', Interactions.reportUser, Interactions.updateBlock);
  app.get('/api/blocks/:target', Interactions.getBlockStatus);
  app.post('/api/blocks/:target', Interactions.updateBlock);

  // chat  ===============
  app.get('/api/chat/:target', rejectedCatcher(Chat.getMessages));

  // Notifications  ===============
  app.get('/api/notifications', rejectedCatcher(Notifications.get));

  // Matches  ===============
  app.get('/api/myprofile/matches', rejectedCatcher(Matches.get));
  app.get('/api/myprofile/visits', rejectedCatcher(Visits.get));
  app.get('/api/myprofile/likes', rejectedCatcher(Likes.get));

  // Suggestions ===============
  app.get('/api/suggestions', rejectedCatcher(Suggestions.get));

  // Search  ===============
  app.get('/api/search', rejectedCatcher(Search.advancedSearch));
};

export default routes;

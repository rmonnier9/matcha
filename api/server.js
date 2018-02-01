const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

const MongoConnection = require('./MongoConnection');
const routes = require('./routes');
const ChatServer = require('./chat/ChatServer');
/**
 * Connect to MongoDB.
 * Wrap everyting in order to wait for succesfull connection
 */
MongoConnection.connect().then(() => {
  console.log('Connected to Mongo database.');

  const app = express();
  const port = 8000;
  const server = http.createServer(app);
  const io = socketIo(server);
  const upload = multer({ dest: 'uploads/' });

  // load requests parsers
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // expose dist folder
  app.use(express.static(path.join(__dirname, 'build'), {
    dotfiles: 'ignore',
    index: false,
  }));

  // load socket server
  const chatServer = new ChatServer({ io });
  chatServer.init();

  // load all API routes
  routes(app, chatServer.users, upload);

  // custom error handling
  app.use((err, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }
    res.status(500);
    console.error(err);
    res.json({ error: 'Internal server error.' });
  });

  // if a request doesn't match a route, send the front app
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'build', 'index.html')));

  // if the Node process ends, close the Mongoose connection
  const gracefulExit = () => {
    MongoConnection.db.close(() => {
      console.log('Mongo connection successfully disconnected through app termination');
      process.exit(0);
    });
  };
  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

  // launch the server
  server.listen(process.env.PORT || port);
  console.log(`The magic happens on port ${process.env.PORT || port}`);
})
.catch((e) => {
  console.error(e);
});

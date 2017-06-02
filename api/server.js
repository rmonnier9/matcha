import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import multer from 'multer';

import MongoConnection from './config/MongoConnection.js';
import routes from './routes.js';
import ChatServer from './ChatServer.js';

const app = express();
const port = 8000;
const server = http.createServer(app);
const io = socketIo(server);
const upload = multer({ dest: 'uploads/' });

// connect app to the database
MongoConnection.connect();

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
  console.log(err);
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

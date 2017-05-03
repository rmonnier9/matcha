import express          from 'express';
import http					from 'http';
import socketIo			from 'socket.io';
const app              = express();
const port             = 8000;
const server           = http.createServer(app);
const io               = socketIo(server);

import jwt              from 'jsonwebtoken';
import MongoConnection  from './config/MongoConnection.js';

import morgan      	 	from 'morgan';
import cookieParser 		from 'cookie-parser';
import bodyParser   		from 'body-parser';
import fileUpload	  		from 'express-fileupload';
import path           	from 'path';

import config         	from './config/config.js';
import routes         	from './routes.js';
import ChatServer			from './ChatServer.js';

// connect app to the database
MongoConnection.connect();

// load requests parsers
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// front app for chat tests
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// expose dist folder
app.use(express.static(path.join(__dirname, 'dist'), {
  dotfiles: 'ignore',
  index: false
}));

// load chat server
new ChatServer({io: io}).init();

// load all API routes
routes(app);

// if a request doesn't match a route, send the front app
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));

// if the Node process ends, close the Mongoose connection
const gracefulExit = () => {
  MongoConnection.db.close(() => {
    console.log('Mongo connection successfully disconnected through app termination');
    process.exit(0);
 });
};
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// launch the server
server.listen(port);
console.log('The magic happens on port ' + port);

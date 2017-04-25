import express        from 'express';
const app              = express();
const port             = 8000;

import jwt            from 'jsonwebtoken';
import MongoConnection from './config/MongoConnection.js';

import morgan      	  from 'morgan';
import cookieParser 	from 'cookie-parser';
import bodyParser   	from 'body-parser';
import fileUpload	  	from 'express-fileupload';
import path           from 'path';

import config         from './config/config.js';
import routes from './routes.js';

MongoConnection.connect();

// configuration ===============================================================
app.set('superSecret', config.secret);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'dist'), {
  dotfiles: 'ignore',
  index: false
}));

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
app.listen(port);
console.log('The magic happens on port ' + port);

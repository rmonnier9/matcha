import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import User			      		from './class/User.class.js'
import * as Notification		from './Notification.js'
import fs 							from 'fs'
import uuid							from 'uuid'
import path							from 'path'
import _								from 'lodash'
import parser					from './parser.js'

const createFolder = (userPath) => {
  return new Promise((resolve, reject) => {
    fs.access(userPath, fs.F_OK, (err) => {
      if (!err) resolve();
      else
      {
        fs.mkdir(userPath, (err) => {
          if (err) throw err;
			 resolve();
        })
      }
    })
  })
}

const getInfo = (users) => async (req, res) => {
	const {currentUser} = req.decoded;
	const	{login} = req.params;

	// get user from DB
	const usersCollection = MongoConnection.db.collection('users');
	const user = await usersCollection.findOne({login: login, blocked: {$ne: currentUser}});
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'}).end();

	if (currentUser != login) {
		const alreadyVisited = _.find(user.visitedBy, (visitor) => visitor == currentUser);

		// if first visit
		if (!alreadyVisited) {

			// record visit in database
			usersCollection.updateOne({ login: login },
				{
					$inc: { visits: 1 },
					$push: { visitedBy: currentUser }
				});

			// send and update user notifications
			const newNotification = currentUser + " has taken a look at your profile.";
			Notification.send(users, newNotification, user);
		}
	}
	// get and send infos then end request
	const profile = User.getInfos(user);
	return res.json({success: true, message: 'Profile found.', profile}).end();
}

const getMyInfo = async (req, res) => {
	const {currentUser} = req.decoded;

	// get user from DB
	const usersCollection = MongoConnection.db.collection('users');
	const user = await usersCollection.findOne({login: currentUser});
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'}).end();

	// get and send infos then end request
	const profile = User.getInfos(user);
	return res.json({success: true, message: 'Profile found.', profile}).end();
}

const updateInfo = async (req, res) => {
  const {currentUser} = req.decoded
  const { body } = req

  // parse the form fields
  const error = parser.updateForm(body);
  if (error != null) return res.json({ success: false, error }).end();


	// filter parameters that can be updated with a whitelist
	const whitelist = ['firstname', 'lastname', 'gender', 'lookingFor', 'about', 'tags', 'profilePictureId', 'localisation'];
	const update = {};
	for (let ix in whitelist)
	{
		const field = whitelist[ix];
		if (body.hasOwnProperty(field)) update[field] = body[field];
	}
	if (body.hasOwnProperty('birthDate')) update['birthDate'] = new Date(body['birthDate'])

	// update user in DB
	const usersCollection = MongoConnection.db.collection('users');
   const r = await usersCollection.updateOne({ login: currentUser }, {$set: update});
	return res.json({success: true, message: 'Profile successfully updated.'}).end();
}

const getPicture = async (req, res, next) => {
	const {currentUser} = req.decoded;
	const	{login, id} = req.params;

	const usersCollection = MongoConnection.db.collection('users');
	const user = await usersCollection.findOne({ login:  login, blocked: {$ne: currentUser}});
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'});
	const pictureExists = user.pictures.indexOf(id);
	if (pictureExists == -1) return res.status(404).json({success: false, message: 'Picture not found.'});
	res.sendFile(path.resolve(__dirname, './images/' + login + '/' + id), (err) => {
		if (err) next(err);
		else console.log('Sent:', id);
	})
}

const postPicture = async (req, res, next) => {
	console.log(req);
	// check if a file has been uploaded
	if (!req.files || !req.files.image)
	 return res.status(400).json({success: false, message: 'No images were uploaded.'});

	const {image} = req.files;
	const {currentUser} = req.decoded;
	const	{login} = req.params;

	// check permission
	if (login != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t update this profile.'});

	// check if the user has less than 5 pictures
	const usersCollection = MongoConnection.db.collection('users');
	const user = await usersCollection.findOne({login: login });
	if (user.pictures.length >= 5)
		return res.status(400).json({success: false, message: 'Too many images.'});

	// create user folder if needed
	const userPath = './images/' + login;
	createFolder(userPath).then( () => {

		// create a unique id for the picture and add it to DB
      const imageId = uuid.v4();
      const pictures = [...user.pictures, imageId];
      usersCollection.update({login: login }, {pictures: pictures}, (err, r) => {
      	if (err) throw err;

			// save the picture in user folder and end requests
      	const imagePath = userPath + '/' + imageId;
      	image.mv(imagePath, (err) => {
      		if (err);
         	return res.status(500).json({success: false, message: err});
         	return res.json({success: true, message: 'File uploaded!'}).end();
   		})
      })
	})
}


export {getInfo, getMyInfo, updateInfo, getPicture, postPicture}

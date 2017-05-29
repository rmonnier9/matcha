import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import * as UsersTools			from './UsersTools.js'
import * as Notification		from './Notification.js'
import fs 							from 'fs'
import uuid							from 'uuid'
import path							from 'path'
import _								from 'lodash'
import parser						from './parser.js'

const createFolder = (userPath) => {
  return new Promise((resolve, reject) => {
    fs.access(userPath, fs.F_OK, (err) => {
      if (!err) resolve();
      else
      {
        fs.mkdir(userPath, (err) => {
          if (err) throw err
			 resolve()
        })
      }
    })
  })
}

const getNotifications = async (req, res) => {
	const {currentUser} = req.decoded
	const {start} = req.query

	// get user from DB
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser})
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'}).end()

	// get and send infos then end request
	const {notifications} = user
	return res.json({success: true, message: 'Notifications found.', notifications}).end()
}

const getInfos = (users) => async (req, res) => {
	const {currentUser} = req.decoded
	const	{login} = req.params

	// get user from DB
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: login, blocked: {$ne: currentUser}})
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'}).end()

	if (currentUser != login) {
		const alreadyVisited = _.find(user.visitedBy, (visitor) => visitor == currentUser)

		// if first visit
		if (!alreadyVisited) {

			// record visit in database
			usersCollection.updateOne({ login: login },
				{
					$inc: { visits: 1 },
					$push: { visitedBy: currentUser }
				})

			// send and update user notifications
			const newNotification = currentUser + " has taken a look at your profile."
			Notification.send(users, newNotification, user)
		}
	}
	// get and send infos then end request
	const currentUserData = await usersCollection.findOne({login: currentUser})
	const profile = UsersTools.getInfos(user, currentUserData)
	return res.json({success: true, message: 'Profile found.', profile}).end()
}

const getMyInfos = async (req, res) => {
	const {currentUser} = req.decoded
	// console.log(req);

	// get user from DB
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser})
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'}).end()

	// get and send infos then end request
	const profile = UsersTools.getPrivateInfos(user)
	return res.json({success: true, message: 'Profile found.', profile}).end()
}

const updateInfo = async (req, res) => {
  const {currentUser} = req.decoded
  const { body } = req
  console.log(body);

  // parse the form fields
  const error = parser.updateForm(body);
  if (error != null) return res.json({ success: false, error }).end();


	// filter parameters that can be updated with a whitelist
	const whitelist = ['firstname', 'lastname', 'gender', 'birthDate', 'about', 'tags', 'profilePictureId', 'localisation', 'latitude', 'longitude']
	const update = {}
	for (let ix in whitelist)
	{
		const field = whitelist[ix]
		if (body.hasOwnProperty(field) && body[field]) update[field] = body[field]
	}
	if (body.hasOwnProperty('lookingFor') && body['lookingFor']) update['lookingFor'] = body.lookingFor === 'both' ? ['male', 'female'] : [body.lookingFor]

	// update user in DB
	const usersCollection = MongoConnection.db.collection('users')
   const r = await usersCollection.updateOne({ login: currentUser }, {$set: update})
	return res.json({success: true, message: 'Profile successfully updated.'}).end()
}

const getPicture = async (req, res, next) => {
	const {currentUser} = req.decoded
	const	{login, id} = req.params

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({ login:  login, blocked: {$ne: currentUser}})
	if (!user) return res.status(404).json({success: false, message: 'Profile not found.'})
	const pictureExists = user.pictures.indexOf(id)
	if (pictureExists == -1) return res.status(404).json({success: false, message: 'Picture not found.'})
	res.sendFile(path.resolve(__dirname, './images/' + login + '/' + id), (err) => {
		if (err) next(err)
	})
}

const deletePicture = async (req, res, next) => {
	const {currentUser} = req.decoded
	const	{id} = req.params

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })

	const pictureExists = user.pictures.indexOf(id)
	if (pictureExists === -1) return res.status(404).json({success: false, message: 'Picture not found.'})

	const userPath = './images/' + currentUser + '/' + id
	fs.unlink(userPath, (err) => {
		if (err) next(err)

		let { pictures, profilePicture } = user
		let index = pictures.indexOf(id)
		if (profilePicture == index) {
			pictures.splice(index, 1)
			index = 0
		}
		else {
			pictures.splice(index, 1)
			index = pictures.indexOf(id)
		}
		const update = {pictures: pictures, profilePicture: index}
		usersCollection.updateOne({login: currentUser }, {$set: update})
		return res.json({success: true, message: 'Image succesfully deleted!'}).end()
	})
}

const postPicture = async (req, res, next) => {
	// check if a file has been uploaded
	if (!req.files || !req.files.image)
	 return res.status(400).json({success: false, message: 'No images were uploaded.'});

	const {image} = req.files
	const {currentUser} = req.decoded

	// check if the user has less than 5 pictures
	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })
	if (user.pictures.length >= 5)
		return res.status(400).json({success: false, message: 'Too many images.'})

	// create user folder if needed
	const userPath = './images/' + currentUser
	await createFolder(userPath)
	// create a unique id for the picture and add it to DB
   const imageId = uuid.v4()
   const pictures = [...user.pictures, imageId]
	const update = {pictures: pictures}
   const r = await usersCollection.updateOne({login: currentUser }, {$set: update})

	// save the picture in user folder and end requests
	const imagePath = userPath + '/' + imageId
	image.mv(imagePath, (err) => {
		if (err) return res.status(500).json({success: false, message: err})
   	return res.json({success: true, message: 'File uploaded!'}).end()
	})
}


export {getInfos, getMyInfos, updateInfo, getPicture, deletePicture, postPicture, getNotifications}

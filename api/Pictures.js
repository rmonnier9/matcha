import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import * as UsersTools			from './UsersTools.js'
import * as Notification		from './Notifications.js'
import fs 							from 'fs'
import path							from 'path'
import _								from 'lodash'
import parser						from './parser.js'

// browser expect a content type img, res.json is then useless
const get = async (req, res, next) => {
	const {currentUser} = req.decoded
	const	{login, id} = req.params
	const defaultPath = path.resolve(__dirname, './uploads/no-picture.png')

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({ login:  login, blocked: {$ne: currentUser}})
	if (!user) return res.sendFile(defaultPath, (err) => {if (err) next(err)})

	const pictureExists = user.pictures.indexOf(id)
	const imgPath = path.resolve(__dirname, './uploads/' + id)
	fs.access(imgPath, fs.F_OK, (err) => {
		if (err || pictureExists == -1) res.sendFile(defaultPath, (err) => {if (err) next(err)})
		else res.sendFile(imgPath, (err) => {if (err) next(err)})
	})
}

const remove = async (req, res, next) => {
	const {currentUser} = req.decoded
	const	{id} = req.params

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })

	const pictureExists = user.pictures.indexOf(id)
	if (pictureExists === -1) return res.json({success: false, message: 'Picture not found in db.'})

	const imgPath = './uploads/' + id
	fs.unlink(imgPath, (err) => {
		if (err) return res.json({success: false, message: 'Picture not found on server.'})
		const pictures = user.pictures.filter((picture) => picture !== id)

		let profilePicture = pictures.indexOf(id)
		if (profilePicture === -1) {profilePicture = pictures.length === 0 ? -1 : 0}

		const update = {pictures, profilePicture}
		usersCollection.updateOne({login: currentUser }, {$set: update})
		return res.json({success: true, message: 'Image succesfully deleted!'}).end()
	})
}

const saveCheck = async (req, res, next) => {
	const {currentUser} = req.decoded


	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })
	if (user.pictures.length >= 5)
		return res.json({success: false, message: 'Too many images.'})
	req.user = user
	next()
}

const save = async (req, res, next) => {
	const {user} = req
	const {currentUser} = req.decoded
	const {filename} = req.file

	// check if a file has been uploaded
	if (!req.file)
	 return res.json({success: false, message: 'No images were uploaded.'})

	// save filename in db
   const pictures = [...user.pictures, filename]
	const update = {pictures: pictures}
	const usersCollection = MongoConnection.db.collection('users')
   usersCollection.updateOne({login: currentUser }, {$set: update})
   return res.json({success: true, message: 'File uploaded!', pictures}).end()

}


export {save, saveCheck, get, remove}

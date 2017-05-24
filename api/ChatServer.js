import jwt						from 'jsonwebtoken'
import _							from 'lodash'
import moment					from 'moment'

import config        		from './config/config.js'
import MongoConnection		from './config/MongoConnection.js'
import parser					from './parser.js'
import * as Notification	from './Notification.js'

class ChatServer {
	constructor(options) {
		this.io = options.io
		this.users = []
	};

	init() {
		this.io.on('connection', (socket) => {
			console.log('connected')
			socket.on('auth', this.auth(socket))
		})
	}

	auth(socket) {
		return ((token) => {
			jwt.verify(token, config.secret, (err, decoded) => {
				if (err) return socket.emit('auth', 'Auth error : Invalid token.')
				const {currentUser} = decoded

				// create a new user
				const newUser = { login: currentUser, socket: socket }
				// push to users array
				this.users.push(newUser)

				const usersCollection = MongoConnection.db.collection('users')
			   usersCollection.updateOne({ login: currentUser },
													{ $set: { lastConnection: 'connected' },
												})

				// set response listeners for the new user
				this.setResponseListeners(newUser)
				// send welcome message to user
				socket.emit('auth', 'you are logged in chat!')
				console.log(currentUser + ' is connected')
				// send user joined message to all users
				// this.io.sockets.emit('userJoined', newUser.user);
			})
		})
	}

	setResponseListeners(user) {
		user.socket.on('disconnect', () => {
			// remove the user
			_.remove(this.users, (value) => user.socket.id == value.socket.id)

			// check if there is no more socket connection for the user
			const isConnected = _.find(this.users, (value) => user.login == value.login)

			// in that case, set last connection
			if (!isConnected) {
				const usersCollection = MongoConnection.db.collection('users')
				usersCollection.updateOne({ login: user.login },
													{
														$set: { lastConnection: moment().format() },
													})
			}
		})

		user.socket.on('onlineUsers', () => {
			const onlineUsers = _.map(this.users, (item) => {
				return item.login
			})
			user.socket.emit('onlineUsers', onlineUsers)
		})

		user.socket.on('message', ({ text, target }) => {

			console.log("message", text, target)
			// parse the message
		  if (!parser.message(text)) return false

		  // get user from DB
		  const usersCollection = MongoConnection.db.collection('users')
		  usersCollection.findOne({
			  								login: target,
			  								blocked: {$not: {$eq: user.login}},
											matches: user.login
											}, (err, targetUser) => {
			  if (err) throw err
			  if (!targetUser) return false

			  // add message to DB
			  const chatCollection = MongoConnection.db.collection('chat')
			  chatCollection.insertOne({ from: user.login,
												  target,
												  text,
												  at: moment().format()
											  })

				// check if user is connected
			  const socketTargets = this.users.filter((user) => user.login == target)
			  if (socketTargets.length) {
				  const message = {from: user.login, target, text}
				  socketTargets.forEach((user) => {
						  						user.socket.emit('message', message)
					  							})
			  }
			  else {
				  // send and update user notifications
					const newNotification = user.login + " has sent you a message."
					Notification.send(this.users, newNotification, targetUser)
			  }
		  })
		})
	}
}


export default ChatServer

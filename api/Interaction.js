import MongoConnection  from './config/MongoConnection.js'
import Interaction      from './class/Interaction.class.js'

const getInterest = (req, res) => {
  const	{current, target} = req.params
	const {currentUser} = req.decoded
	console.log(current, currentUser);
	if (current != currentUser) return res.json({success: false, message: 'No rights for accessing this interaction.'})

	MongoConnection.db.collection('interactions').findOne({users: {$all: [current, target]}}, (err, interaction) => {
		if (err) throw err
		if (!interaction) {
			MongoConnection.db.collection('users').findOne({ login:  target }, (err, user) => {
				if (err) throw err
				if (!user) return res.json({success: false, message: "User targeted doesn't exist."})
				return res.json({success: true, data: null})
			})
		}
		else {
			const {users, userA, userB} = interaction
			const data = {users, userA, userB}
			res.json({success: true, data: data})
		}
	})
}

const updateInterest = (req, res) => {
  const	{current, target} = req.params
	const {currentUser} = req.decoded
  const {like} = req.body
	// console.log(current, currentUser, like);
	if (current != currentUser) return res.json({success: false, message: 'No rights for accessing this interaction.'})

	MongoConnection.db.collection('interactions').findOne({users: {$all: [current, target]}}, (err, interaction) => {
		if (err) throw err
		if (!interaction) {
			MongoConnection.db.collection('users').findOne({ login:  target }, (err, user) => {
				if (err) throw err
				if (!user) return res.json({success: false, message: "User targeted doesn't exist."})
        const data = Interaction.create()
        MongoConnection.db.collection('interactions').insertOne(data, (err, r) => {
          if (err) throw err
          return res.json({success: true, message: "User Liked !"})
        })
			})
		}
		else {
			console.log(interaction);
      toChange = interaction.users[0] == current ? "userA" : "userB";
      MongoConnection.db.collection('interactions').update(interaction, {} (err, r) => {
        if (err) throw err
        return res.json({success: true, message: "User Liked !"})
      })
		}
	})
}


export {getInterest, updateInterest}

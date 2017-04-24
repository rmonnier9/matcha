import MongoConnection  from './config/MongoConnection.js'
import Interaction      from './class/Interaction.class.js'

const getInterest = (req, res) => {
  const	{current, target} = req.params
	const {currentUser} = req.decoded
	if (current != currentUser) return res.json({success: false, message: 'No rights for accessing this interaction.'})
	MongoConnection.db.collection('interactions').findOne({"current": current, "target": target}, (err, interaction) => {
		if (err) throw err
		console.log(interaction);
		const data = interaction == null ? false : interaction.hasLiked;
		res.json({success: true, data: data})
	})
}

const updateInterest = (req, res) => {
  let {hasLiked} = req.body;
  if (hasLiked != 'true' && hasLiked != 'false') return res.json({success: false, message: 'hasLiked must be either true or false.'});
  hasLiked = hasLiked == 'true' ? true : false;

  const	{current, target} = req.params;
  const {currentUser} = req.decoded;
  if (current != currentUser) return res.json({success: false, message: 'No rights for update this interaction.'});

  // console.log(current, currentUser, hasLiked);

	MongoConnection.db.collection('interactions').findOne({"current": current, "target": target}, (err, interaction) => {
		if (err) throw err;
		if (!interaction) {
			MongoConnection.db.collection('users').findOne({ login:  target }, (err, user) => {
				if (err) throw err;
				if (!user) return res.json({success: false, message: "User targeted doesn't exist."});
				newInteraction = Interaction.create(current, target);
				newInteraction.hasLiked = hasLiked;
				MongoConnection.db.collection('interactions').insertOne(newInteraction, (err, r) => {
	          	if (err) throw err;
					const messageAction = hasLiked == true ? ' now likes ' : ' now doesn\'t like ';
	 			  	const message = current + messageAction + target + '.';
	          	return res.json({success: true, message: message});
        		})
			})
		}
		else {
			const updatedInteraction = Object.assign({}, interaction);
			updatedInteraction.hasLiked = hasLiked;
	      MongoConnection.db.collection('interactions').update(updatedInteraction, {}, (err, r) => {
	        if (err) throw err;
			  const messageAction = hasLiked == true ? ' now likes ' : ' now doesn\'t like ';
			  const message = current + messageAction + target + '.';
			  return res.json({success: true, message: message});
		  });
		}
	});
}


export {getInterest, updateInterest}

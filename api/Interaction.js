import MongoConnection  from './config/MongoConnection.js';
import mail						from './mail.js';
import * as notification	from './Notification.js';

const getInterest = (req, res) => {
  const	{current, target} = req.params
	const {currentUser} = req.decoded
	if (current != currentUser) return res.json({success: false, message: 'No rights for accessing this interaction.'})

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({login: target, blocked: {$not: {$eq: currentUser}}}, (err, user) => {
		if (err) throw err
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});

		// check if current likes target
		const data = user.interestedPeople.indexOf(current) == -1 ? false : true;
		res.json({success: true, data: data})
	})
}

const updateInterest = (users) => (req, res) => {
	const {currentUser} = req.decoded;
	const	{current, target} = req.params;
	let {likes} = req.body;

	// parse value of likes field
	if (likes != 'true' && likes != 'false') return res.json({success: false, message: 'Invalid request : likes must be either true or false.'});

	// convert likes into a boolean
	likes = likes == 'true' ? true : false;

	// check permission
	if (current != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t update this interaction.'});

	// check if user try to like himself
	if (current == target) return res.json({success: false, message: 'Wrong target : interest for himself impossible.'});

	// find the target in DB, can't find if blocked by the target
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({"login": target, blocked: {$not: {$eq: currentUser}}}, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});

		// check if target has been already liked
		const alreadyLiked = user.interestedPeople.indexOf(current);

		// like action
		if (likes == true)
		{
			// already liked
			if (alreadyLiked != -1)
			{
				const message = current + ' already likes ' + target + '.';
				return res.json({success: true, message: message});
			}

			// check if target also likes current
			const match = user.interestedIn.indexOf(current);

			// update objects
			const currentUpdate = { $addToSet: {interestedIn: target} };
			const targetUpdate = {
											$addToSet: {interestedPeople: current},
											$inc: { interestCounter: +1 }
										};

			// if match, modify update objects
			if (match != -1) {
				currentUpdate.$addToSet.matches = target;
				targetUpdate.$addToSet.matches = current;
			}
			usersCollection.updateOne({ login: current }, currentUpdate);
			usersCollection.updateOne({ login: target }, targetUpdate);

			// send and update user notifications
			const notification = current + " now likes your profile.";
			Notification.send(users, notification, user);

			const message = current + ' now likes ' + target + '.';
			return res.json({success: true, message: message});
		}

		// unlike action
		else
		{
			// already not liked
			if (alreadyLiked == -1)
			{
				const message = current + ' already doesn\t like ' + target + '.';
				return res.json({success: true, message: message});
			}

			// check if target also likes current
			const match = user.interestedIn.indexOf(current);

			// update objects
			const currentUpdate = { $pull: {interestedIn: target} };
			const targetUpdate = {
											$pull: {interestedPeople: current},
											$inc: { interestCounter: -1 }
										};
			// if match, modify update objects
			if (match != -1) {
				currentUpdate.$pull.matches = target;
				targetUpdate.$pull.matches = current;

				// remove all chat messages
				const chatCollection = MongoConnection.db.collection('chat');
				chatCollection.remove({
									$or: [
										{ 'to': current, 'from': target },
										{ 'from': target, 'to': current }
									]
								});
			}
			usersCollection.updateOne({ login: current }, currentUpdate);
			usersCollection.updateOne({ login: target }, targetUpdate);
			const message = current + ' now doesn\'t like anymore ' + target + '.';
			return res.json({success: true, message: message});
		}
	});
}

const updateBlock = (req, res) => {
	const {currentUser} = req.decoded;
	const	{current, target} = req.params;
	let {blocks} = req.body;

	// parse value of blocks field
	if (blocks != 'true' && blocks != 'false') return res.json({success: false, message: 'Invalid request : blocks must be either true or false.'});

	// convert blocks into a boolean
	blocks = blocks == 'true' ? true : false;

	// check permission
	if (current != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t update this interaction.'});

	// check if user try to block himself
	if (current == target) return res.json({success: false, message: 'Wrong target : block himself impossible.'});

	// find the target in DB, can't find if blocked by the target
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({"login": target, blocked: {$not: {$eq: currentUser}}}, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});

		const blocked = user.blockedBy.indexOf(current);
		if (blocks == true)
		{
			if (blocked != -1)
			{
				const message = current + ' has already blocked ' + target + '.';
				return res.json({success: true, message: message});
			}
			usersCollection.updateOne({ login: current }, {
								$addToSet: {blocked: target}});
			usersCollection.updateOne({ login: target }, {
								$addToSet: {blockedBy: current}});
			const message = current + ' has now blocked ' + target + '.';
			return res.json({success: true, message: message});
		}
		else
		{
			if (blocked == -1)
			{
				const message = current + ' is already not blocked by ' + target + '.';
				return res.json({success: true, message: message});
			}
			usersCollection.updateOne({ login: current }, {
								$pull: {blocked: target}});
			usersCollection.updateOne({ login: target }, {
								$pull: {blockedBy: current}});
			const message = current + ' has now unblocked ' + target + '.';
			return res.json({success: true, message: message});
		}
	});
}

const reportUser = (req, res, next) => {
	const {currentUser} = req.decoded;
	const	{current, target} = req.params;

	if (current != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t make this report.'});
	if (current == target) return res.json({success: false, message: 'Wrong target : report himself impossible.'});

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({"login": target, blocked: {$not: {$eq: currentUser}}}, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});

		const email = "api.matcha@laposte.net";
		const text = "The user " + target + " has been reported as fake by " + current;
		const subject = "Matcha - New fake report";
		mail(email, subject, text);
		const reportsCollection = MongoConnection.db.collection('reports');
		reportsCollection.insertOne({reporter: current, reported: target});
		req.body.blocks = "true";
		next();
	});
}

export {getInterest, updateInterest, updateBlock, reportUser}

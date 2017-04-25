import MongoConnection  from './config/MongoConnection.js'
import mail						from './mail.js'

const getInterest = (req, res) => {
  const	{current, target} = req.params
	const {currentUser} = req.decoded
	if (current != currentUser) return res.json({success: false, message: 'No rights for accessing this interaction.'})

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({login: current, interestedPeople: target}, (err, user) => {
		if (err) throw err
		console.log(user);
		const data = user == null ? false : true;
		res.json({success: true, data: data})
	})
}

const updateInterest = (req, res) => {
	const {currentUser} = req.decoded;
	const	{current, target} = req.params;
	let {likes} = req.body;

	if (likes != 'true' && likes != 'false') return res.json({success: false, message: 'Invalid request : likes must be either true or false.'});
	likes = likes == 'true' ? true : false;
	if (current != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t update this interaction.'});
	if (current == target) return res.json({success: false, message: 'Wrong target : interest for himself impossible.'});
  // console.log(current, currentUser, hasLiked);

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({"login": target}, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});
		console.log(user);
		const liked = user.interestedPeople.indexOf(current);
		if (likes == true)
		{
			if (liked != -1)
			{
				const message = current + ' already likes ' + target + '.';
				return res.json({success: true, message: message});
			}
			usersCollection.updateOne({ login: current }, {
								$addToSet: {interestedIn: target}});
			usersCollection.updateOne({ login: target }, {
								$addToSet: {interestedPeople: current},
								$inc: { interestCounter: -1 }});
			const message = current + ' now likes ' + target + '.';
			return res.json({success: true, message: message});
		}
		else
		{
			if (liked == -1)
			{
				const message = current + ' already doesn\t like ' + target + '.';
				return res.json({success: true, message: message});
			}
			usersCollection.updateOne({ login: current }, {
								$pull: {interestedIn: target}});
			usersCollection.updateOne({ login: target }, {
								$pull: {interestedPeople: current},
								$inc: { interestCounter: +1 }});
			const message = current + ' now doesn\'t like anymore ' + target + '.';
			return res.json({success: true, message: message});
		}
	});
}

const updateBlock = (req, res) => {
	const {currentUser} = req.decoded;
	const	{current, target} = req.params;
	let {blocks} = req.body;

	if (blocks != 'true' && blocks != 'false') return res.json({success: false, message: 'Invalid request : blocks must be either true or false.'});
	blocks = blocks == 'true' ? true : false;
	if (current != currentUser) return res.json({success: false, message: 'Permission denied : you can\'t update this interaction.'});
	if (current == target) return res.json({success: false, message: 'Wrong target : block himself impossible.'});
  // console.log(current, currentUser, reports);

	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.findOne({"login": target}, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({success: false, message: 'Wrong target : user targeted doesn\'t exists'});
		console.log(user);
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
	const email = "api.matcha@laposte.net";
	const text = "The user " + target + " has been reported as fake by " + current;
	const subject = "Matcha - New fake report";
	mail(email, subject, text);
	const reportsCollection = MongoConnection.db.collection('reports');
	reportsCollection.insertOne({reporter: current, reported: target});
	req.body.blocks = "true";
	next();
}

export {getInterest, updateInterest, updateBlock, reportUser}

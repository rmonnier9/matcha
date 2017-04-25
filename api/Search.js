import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import User			      		from './class/User.class.js'

const getInfo = (req, res) => {
	const {currentUser} = req.decoded;
	const {query} = req;

	// initialize the search object (parameter of find() )
	const searchOBJ = {
		$and: [
			{blockedBy: { $ne: currentUser }}
			]
		};
	let i = 1;
	if (query.name)
	{
		const regex = new RegExp(query.name);
		searchOBJ.$and[i] = {
			$or: [
				{ login: regex },
				{ firstname: regex },
				{ lastname: regex },
		] };
	}

	// define number of results per pages
	const numberPerPage = 2;
	const pageNumber = query.page != null ? query.page : 0;
	const toSkip = (pageNumber - 1) * numberPerPage;

	// execute the query in the DB
	const usersCollection = MongoConnection.db.collection('users');
	usersCollection.find(searchOBJ)
		.skip(toSkip).limit(numberPerPage)
		.toArray((err, users) => {
			if (err) throw err;
			return res.json({success: true, message: 'Search successfull.', data: users}).end();
	})
}

export {getInfo}

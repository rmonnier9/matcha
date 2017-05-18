import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import User			      		from './class/User.class.js'
import queryString from 'query-string'

const advancedSearch = async (req, res, next) => {
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
	// if (query.agemin && query.agemax)
	// {
	// 	const ageMin = Date.now() - query.agemin * 360 * 24 * 3600 * 1000
	// 	const ageMin = Date.now() - query.agemin * 360 * 24 * 3600 * 1000
	// 	searchOBJ.$and[i] = {
	// 		$or: [
	// 			{ login: regex },
	// 			{ firstname: regex },
	// 			{ lastname: regex },
	// 	] };
	// }

	// define number of results per requests
	const toSkip = !query.start ? 0 : parseInt(query.start)
	const numberPerRequest = 2

	// execute the query in the DB
	const usersCollection = MongoConnection.db.collection('users');
	const cursor = usersCollection.find(searchOBJ)
											.skip(toSkip).limit(numberPerRequest);
	const users = await cursor.toArray();

	const resObj = {success: true, message: 'Search successfull.', users}
	if (users.length) {
		query.start = toSkip + numberPerRequest
		resObj.nextHref = '/search?' + queryString.stringify(query)
	}
	return res.json(resObj).end();
}

export {advancedSearch}

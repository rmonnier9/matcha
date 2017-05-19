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
		searchOBJ.$and[i++] = {
			$or: [
				{ login: regex },
				{ firstname: regex },
				{ lastname: regex },
		] };
	}
	if (query.age && (query.age === '18to30' || query.age === '30to50' || query.age === 'from50'))
	{
		let dateMax, dateMin
		const {age} = query
		if (age === '18to30')
		{
			dateMax = User.getBirthDate(18)
			dateMin = User.getBirthDate(30)
		}
		else if (age === '30to50')
		{
			dateMax = User.getBirthDate(30)
			dateMin = User.getBirthDate(50)
		}
		else
		{
			dateMax = User.getBirthDate(50)
			dateMin = User.getBirthDate(100)
		}
		searchOBJ.$and[i++] = {
			birthDate: {
				$lt: dateMax
				}
		}
		searchOBJ.$and[i++] = {
			birthDate: {
				$gt: dateMin
				}
		}
	}
	// define number of results per requests
	const toSkip = !query.start ? 0 : parseInt(query.start)
	const numberPerRequest = 2

	// execute the query in the DB
	const usersCollection = MongoConnection.db.collection('users');
	const cursor = usersCollection.find(searchOBJ)
											.skip(toSkip).limit(numberPerRequest);
	const users = await cursor.toArray();

	const resObj = {success: true, message: 'Search successfull.', users, searchOBJ}
	if (users.length) {
		query.start = toSkip + numberPerRequest
		resObj.nextHref = '/search?' + queryString.stringify(query)
	}
	return res.json(resObj).end();
}

export {advancedSearch}

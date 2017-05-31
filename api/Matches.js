import queryString 				from 'query-string'
import _								from 'lodash'

import MongoConnection			from './config/MongoConnection.js'
import config        			from './config/config.js'
import * as UsersTools			from './UsersTools.js'

const get = async (req, res) => {
	const {currentUser} = req.decoded
	const {start} = req.query

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })
	const {matches} = user

	// define number of results per requests
	const toSkip = !start ? 0 : parseInt(start)
	const numberPerRequest = 2
	const nextStart = toSkip + numberPerRequest

	const cursor = usersCollection.find({login: {$in: matches} })
													.skip(toSkip).limit(numberPerRequest)
	let users = await cursor.toArray()
	UsersTools.addUsefullData(users, user)
	users = UsersTools.filterData(users)

	const resObj = {success: true, message: 'Matches found.', users}
	if (matches.length > nextStart) {
		resObj.nextHref = '/matches?start=' + nextStart
	}
	return res.json(resObj).end();
}

export {get}

import config        			from './config/config.js'
import MongoConnection			from './config/MongoConnection.js'
import User			      		from './class/User.class.js'
import queryString from 'query-string'

import _					from 'lodash';
import * as Tools			from './tools';

const getSearchOBJ = (gender, lookingFor, currentUser) => {
	const searchOBJ = {
		$and: [
			{blockedBy: { $ne: currentUser }},
			{blocked: {$ne: currentUser}},
			{gender: {$in: lookingFor}},
			{lookingFor: gender}
			]
		};
	return (searchOBJ)
}

const getSuggestions = async (req, res) => {
	const {currentUser} = req.decoded;

	const usersCollection = MongoConnection.db.collection('users')
	const user = await usersCollection.findOne({login: currentUser })
	const searchOBJ = getSearchOBJ(
		user.gender,
		user.lookingFor,
		currentUser
	)
	const cursor = usersCollection.find(searchOBJ)
	let users = await cursor.toArray()
	console.log("apres find", users);
	await Tools.addUsefullData(users, user)
	users = users.filter((user) => user.distance < 100)

	const age = Tools.getAge(user.birthdate)
	users = users.map((user) => {
		user.score = Tools.getAgeScore(user.age, age);
		user.score += Tools.getPopScore(user.popularity);
		user.score += Tools.getDistScore(user.distance);
		user.score += Tools.getCommonTagsScore(user.commonTags);
		return (user);
	})
	users.sort((userA, userB) => -userA.score - -userB.score);
	users = users.slice(0, 10);
	const resObj = {success: true, message: 'Search successfull.', users}
	return res.json(resObj).end();
}

export {getSuggestions}

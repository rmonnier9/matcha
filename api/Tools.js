import geolib						from 'geolib'

const roundTwo = (nb) => {
	const nbM = nb * 100
	const nbR = Math.floor(nbM)
	return (nbR / 100)
}

const getPopularity = (visits, likes) => roundTwo((likes * 50) / visits) || 0;

const getAge = (birthDate) => {
	if (!birthDate) return null
	if (!(birthDate instanceof Date))
		birthDate = new Date(birthDate)
	const ageDifMs = Date.now() - birthDate.getTime()
	const ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getFullYear() - 1970)
}

const getTagsInCommon = (userA, userB) => {
	let result = []
	const {tags} = userA
	if (tags && tags.length && userB.tags && userB.tags.length) {
		for (let i = 0, len = tags.length ; i < len ; i++)
		{
			if (userB.tags.indexOf(tags[i]) !== -1) result.push(tags[i])
		}
	}
	return result
}

const getDistance = (userA, userB) => {
	const distance = geolib.getDistance({
			latitude: userA.latitude,
			longitude: userA.longitude,
		}, {
			latitude: userB.latitude,
			longitude: userB.longitude,
		})
		const kmDist = distance / 1000
		return (Math.floor(kmDist))
}

const addUsefullData = async (users, currentUser) => {
	return await users.map((user) => {
		user.age = getAge(user.birthDate)
		user.popularity = getPopularity(user.visits, user.interestCounter)
		user.tagsInCommon = getTagsInCommon(user, currentUser)
		user.distance = getDistance(user, currentUser)
		return (user)
	})
}

const getAgeScore = (ageA, ageB) => {
	const ageDiff = ageA - ageB;
	if (ageDiff < 2 || ageDiff > -2) return 100
	else if (ageDiff < 5 || ageDiff > -5) return 75
	else if (ageDiff < 10 || ageDiff > -10) return 50
	else if (ageDiff < 20 || ageDiff > -20) return 25
	return (0);
}

const getDistScore = (dist) => {
	if (dist < 5) return (100);
	else if (dist < 10) return (75);
	else if (dist < 20) return (50);
	else if (dist < 30) return (25);
	return (0);
}

const getCommonTagsScore = (comTags) => {
	if (comTags > 25) return (100);
	else if (comTags > 18) return (75);
	else if (comTags > 10) return (50);
	else if (comTags > 5) return (25);
	return (0);
}

const getPopScore = (pop) => {
	return (pop * 10);
}

export { roundTwo,
	getPopularity,
	getAge,
	getTagsInCommon,
	getDistance,
	addUsefullData,
	getAgeScore,
	getDistScore,
	getCommonTagsScore,
	getPopScore,
}

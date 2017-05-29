import bcrypt   				from 'bcrypt-nodejs'
import geolib						from 'geolib'


// Authentication and activation tools -----------------------------------------
const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

const validPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}

const randomString = (length) => {
	let text = "";
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length))
	}
	return text;
}

// compute data to send to users
const addUsefullData = (users, currentUser) => {
	return users.map((user) => {
		user.age = getAge(user.birthDate)
		user.popularity = getPopularity(user.visits, user.interestCounter)
		user.tagsInCommon = getTagsInCommon(user, currentUser)
		user.distance = getDistance(user, currentUser)
		return (user)
	})
}

const roundTwo = (nb) => {
	const nbM = nb * 100
	const nbR = Math.floor(nbM)
	return (nbR / 100)
}

const getPopularity = (visits, likes) => roundTwo((likes * 50) / visits) || 0;

const getDistance = (userA, userB) => {
	if (!userA.latitude || !userA.longitude || !userB.latitude || !userB.longitude)
		return null
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

const getAge = (birthDate) => {
	if (!birthDate) return null
	if (!(birthDate instanceof Date))
		birthDate = new Date(birthDate)
	const ageDifMs = Date.now() - birthDate.getTime()
	const ageDate = new Date(ageDifMs)
	return Math.abs(ageDate.getFullYear() - 1970)
}

const getBirthDate = (age) => {
	if (!age) return null

	const date = new Date()
	console.log("date", date);
	const currentYear = date.getFullYear()
	console.log("year", currentYear);
	date.setFullYear(currentYear - age)
	console.log(date.toDateString());

	return (date)
}

// New profile -----------------------------------------------------------------
const create = (email, firstname, lastname, login, password, activationString) => {
  const emptyArray = []
  const hashedPassword = generateHash(password)
  return ({
	  		login,
			password: hashedPassword,
	  		email,
			firstname,
			lastname,
			pictures: emptyArray,
			profilePicture: 0,
			interestedIn: emptyArray,
			interestedPeople: emptyArray,
			blocked: emptyArray,
			blockedBy: emptyArray,
			interestCounter: 0,
			visits: 0,
			visitedBy: emptyArray,
			tags: emptyArray,
			notifications: emptyArray,
			matches: emptyArray,
			lookingFor: ["male", "female"],
			active: false,
			activationString: activationString,
			lastConnection: new Date(),
			birthDate: null,
		})
}
const filterData = (users) => {
	return users.map((user) => {
		return filterInfos(user)
	})
}

// Infos to send --------------------------------------------------------------

// public profile
const getInfos = (user, currentUser) => {
	user.age = getAge(user.birthDate)
	user.popularity = getPopularity(user.visits, user.interestCounter)
	user.distance = getDistance(user, currentUser)
	return filterInfos(user)
}

const filterInfos = (user) => {
	const {	login,
				firstname,
				lastname,
				age,
				gender,
				lookingFor,
				about,
				tags,
				pictures,
				profilePicture,
				popularity,
				distance,
				lastConnection,
			} = user
	return {
				login,
				firstname,
				lastname,
				age,
				gender,
				lookingFor,
				about,
				tags,
				pictures,
				profilePicture,
				popularity,
				distance,
				lastConnection,
			}
}

// private profile
const getPrivateInfos = (user) => {
	const {latitude, longitude} = user
	user.location = {latitude, longitude}
	user.age = getAge(user.birthDate)
	user.popularity = getPopularity(user.visits, user.interestCounter)
	return filterPrivateInfos(user)
}

const filterPrivateInfos = (user) => {
	const {	login,
				email,
				firstname,
				lastname,
				age,
				gender,
				lookingFor,
				about,
				tags,
				pictures,
				profilePicture,
				popularity,
				location,
				lastConnection,
			} = user
	return {
				login,
				email,
				firstname,
				lastname,
				age,
				gender,
				lookingFor,
				about,
				tags,
				pictures,
				profilePicture,
				popularity,
				location,
				lastConnection,
			}
}

// score computation for suggestions
const addScore = (users, user) => {
	const age = getAge(user.birthDate)
	return users.map((user) => {
		user.score = getAgeScore(user.age, age);
		user.score += getPopScore(user.popularity);
		user.score += getDistScore(user.distance);
		user.score += getCommonTagsScore(user.commonTags);
		return (user);
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

export { getInfos,
			getPrivateInfos,
			create,
			randomString,
			getBirthDate,
			getAge,
			filterData,
			addUsefullData,
			validPassword,
			generateHash,
			addScore
}

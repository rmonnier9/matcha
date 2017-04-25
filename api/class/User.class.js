import bcrypt   				from 'bcrypt-nodejs';

class User {
	static generateHash(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
	}

	static validPassword(password, hashedPassword) {
	    return bcrypt.compareSync(password, hashedPassword)
	}


	static getAge(birthDate) {
		if (!birthDate) return null
		const ageDifMs = Date.now() - birthDate.getTime()
		const ageDate = new Date(ageDifMs)
		return Math.abs(ageDate.getUTCFullYear() - 1970)
	}

	static create(email, login, password) {
	  const emptyArray = [];
	  const newPassword = this.generateHash(password);
	  return ({
		  		login: login,
				password: newPassword,
				email: email,
				pictures: emptyArray,
				interestedIn: emptyArray,
				interestedPeople: emptyArray,
				blocked: emptyArray,
				blockedBy: emptyArray
			});
	}

	static getInfos(user) {
		const {login, firstname, lastname, about, tags, pictures, profilePictureId, popularity, localisation, birthDate} = user;
		const age = this.getAge(birthDate);
		return {login, firstname, lastname, age, about, tags, pictures, profilePictureId, popularity, localisation};
	}
}

export default User

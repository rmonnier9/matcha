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

	static randomString(length) {
   	let text = "";
   	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   	for (let i = 0; i < length; i++) {
   		text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
 	}

	static create(email, login, password, activationString) {
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
				blockedBy: emptyArray,
				active: false,
				activationString: activationString
			});
	}

	static getInfos(user) {
		const {login, firstname, lastname, about, tags, pictures, profilePictureId, popularity, localisation, birthDate} = user;
		const age = this.getAge(birthDate);
		return {login, firstname, lastname, age, about, tags, pictures, profilePictureId, popularity, localisation};
	}
}

export default User

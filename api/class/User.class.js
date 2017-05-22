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
		if (!(birthDate instanceof Date))
			birthDate = new Date(birthDate);
		const ageDifMs = Date.now() - birthDate.getTime();
		const ageDate = new Date(ageDifMs);
		return Math.abs(ageDate.getFullYear() - 1970);
	}

	static getBirthDate(age) {
		if (!age) return null

		const date = new Date()
		console.log("date", date);
		const currentYear = date.getFullYear()
		console.log("year", currentYear);
		date.setFullYear(currentYear - age)
		console.log(date.toDateString());

		return (date)
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
		const {login, firstname, lastname, about, tags, pictures, profilePicture, popularity, localisation, birthDate, lastConnection} = user;
		const age = this.getAge(birthDate);
		return {login, firstname, lastname, age, about, tags, pictures, profilePicture, popularity, localisation, lastConnection};
	}
}

export default User

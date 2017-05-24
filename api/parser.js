import * as UsersTools		from './UsersTools.js'

const loginField = (login) => {
  const field = "login";
  if (!login) return {field, message: "Login is required."};

	// check login size
  if (!(login.length >= 4 && login.length <= 10)) return {field, message: "Login must contain between 4 and 10 characters."};

	// check if login only contains alphanums
  if (!login.match(/^[a-zA-Z0-9]+$/)) return {field, message: "Login must only contain alphanumeric characters."};
  return (null);
}

const passwordField = (password, confirmpassword) => {
  const field = "password";
  if (!password) return {field, message: "Password is required."};

	// check if the two passwords are the same
  if (password != confirmpassword) return {field, message: "Passwords are different." }

  // check password size
  if (!(password.length >= 6 && password.length <= 24)) return {field, message: "Password must contain between 6 and 24 characters."};

	// check if password has at least one lower, one upper and one digit
  if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)) return {field, message: "Password must contain at least one uppercase, one lowercase and one digit."};
  return (null);
}

const nameField = (field, text) => {
  if (!text) return (null);

	//check name size
  if (!(text.length >= 1 && text.length <= 32)) return {field, message: field + " must contain between 1 and 32 characters."};

	// check if name only contains alphanums
  if (!text.match(/^[a-zA-Z0-9]+$/)) return {field, message: field + " must only contain alphanumeric characters."};
  return (null);
}

const genderField = (gender) => {
	const field = "gender";
	if (!gender) return (null);

	// check if the value is valid
	if (!gender.match(/^(male|female)$/)) return ({field, message: 'Gender must be either male or female.' });
	return (null);
};

const lookingForField = (lookingFor) => {
	const field = "lookingFor";
	if (!lookingFor) return (null);

	// check if the value is valid
	if (!lookingFor.match(/^(male|female|both)$/)) return ({field, message: 'lookingFor must be either male, female or both.' });
	return (null);
};

const birthDateField = (birthDate) => {
	const field = "birthdate";
	if (!birthDate) return (null);

	// check if date format is valid
	if (!birthDate.match(/^((?:19|20)\d{2})-(0?\d|1[012])-(0?\d|[12]\d|3[01])$/))
		return ({field, message: "Invalid date format."});

	// check if user is older than 18
	const age = UsersTools.getAge(birthDate);
	if (age < 18) return ({field, message: "You must be older than 18."});
	return (null);
};

const tagsField = (tagsTab) => {
	const field = "tags";
	if (!tagsTab) return (null);

	if (!(tagsTab instanceof Array)) return ({field, message: "tagsTab must be an array."});
	for (let ix in tagsTab)
	{
		if (!tagsTab[ix].match(/^[a-zA-Z]+$/)) return ({field, message: "index " + ix + " : tags must only contain letters." });
		if (!(tagsTab[ix].length >= 1 && tagsTab[ix].length <= 16)) return ({field, message: "index " + ix + "tags must contains between 1 and 16 letters." });
	}
	return (null);
};

const aboutField = (about) => {
	const field = "about";
	if (!about) return (null);

 	//check text size
   if (!(text.length >= 1 && text.length <= 160)) return {field, message: "about must contain between 1 and 160 characters."};

 	// check content
   if (!text.match(/^[a-zA-Z0-9 .,:;\?!'-\s]+$/)) return {field, message: "Invalid characters."};
   return (null);
};

const message = (message) => {
	if (!message) return (false);

 	//check message size
   if (!(message.length >= 1 && message.length <= 160)) return (false);

 	// check content
   if (!message.match(/^[a-zA-Z0-9 .,:;\?!'-\s]+$/)) return (false);
   return (true);
};

const signupForm = (data) => {
  const error = [];
  let testVal;
  testVal = loginField(data.login);
  if (testVal != null) error.push(testVal);
  testVal = passwordField(data.password, data.confirmpassword);
  if (testVal != null) error.push(testVal);
  return error.length == 0 ? null : error;
}

const updateForm = (data) => {
	const error = [];
	let testVal;
	testVal = nameField("firstname", data.firstname);
   if (testVal != null) error.push(testVal);
	testVal = nameField("lastname", data.lastname);
	if (testVal != null) error.push(testVal);
	testVal = genderField(data.gender);
	if (testVal != null) error.push(testVal);
	testVal = lookingForField(data.lookingFor);
	if (testVal != null) error.push(testVal);
	testVal = birthDateField(data.birthDate);
	if (testVal != null) error.push(testVal);
	testVal = tagsField(data.tags);
	if (testVal != null) error.push(testVal);
	testVal = aboutField(data.about);
	if (testVal != null) error.push(testVal);
	return error.length == 0 ? null : error;
}

export default {signupForm, passwordField, loginField, updateForm, message}

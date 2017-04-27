const loginField = (login) => {
  const field = "login";

  if (!login) return {field, message: "Login is required."};
  if (!(login.length >= 4 && login.length <= 10)) return {field, message: "Login must contain between 4 and 10 characters."};
  if (!login.match(/^[a-zA-Z0-9]+$/)) return {field, message: "Login must only contain alphanumeric characters."};
  return (null);
}

const passwordField = (password, confirmpassword) => {
  const field = "password";

  if (!password) return {field, message: "Password is required."};
  if (password != confirmpassword) return {field, message: "Passwords are different." }
  if (!password) return {field, message: "Password is required."};
  if (!(password.length >= 6 && password.length <= 24)) return {field, message: "Password must contain between 6 and 24 characters."};
  if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/)) return {field, message: "Password must contain at least one uppercase, one lowercase and one digit."};
  return (null);
}

const nameField = (field, text) => {
  if (!text) return (null);
  if (!(text.length >= 1 && text.length <= 32)) return {field, message: field + " must contain between 1 and 32 characters."};
  if (!text.match(/^[a-zA-Z0-9]+$/)) return {field, message: field + " must only contain alphanumeric characters."};
  return (null);
}

const genderField = (gender) => {
	const field = "gender";

	if (!gend) return (null);
	if (!gend.match(/^(male|female)$/)) return ({ path, error: 'Gender must be either male or female.' });
	return (null);
};

const lookingForField = (lookingFor) => {
	const field = "lookingFor";

	if (!gend) return (null);
	if (!gend.match(/^(male|female|both)$/)) return ({ path, error: 'lookingFor must be either male, female or both.' });
	return (null);
};

const birthDateField = (birthDate) => {
	const field = "birthdate";

	if (!birthDate) return (null);
	if (!birth.match(/^(0?\d|1[012])-(0?\d|[12]\d|3[01])-((?:19|20)\d{2})$/))
		return ({ path, error: 'invalid entry' });
	if (birth.length !== 10) return ({ path, error: 'invalid entry' });
	const today = new Date();
	const birthConv = new Date(birth);
	const age = today.getFullYear() - birthConv.getFullYear();
	const month = today.getMonth() - birthConv.getMonth();
	const errorAge = { path, error: 'Too young' };
	if (month < 0 || (month === 0 && today.getDate() < birthConv.getDate()))
	{
		if (age - 1 < 18)
			return (errorAge);
	}
	else if (age < 18)
		return (errorAge);
	return (null);
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

const updateForm = (date) => {
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
	return error.length == 0 ? null : error;
}

export default {signupForm, passwordField, loginField, updateForm}

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

const signupForm = (data) => {
  const error = [];
  let testVal;
  testVal = loginField(data.login);
  if (testVal != null) error.push(testVal);
  testVal = passwordField(data.password, data.confirmpassword);
  if (testVal != null) error.push(testVal);
  return error.length == 0 ? null : error;
}

export default {signupForm, passwordField, loginField}

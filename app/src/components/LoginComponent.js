import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const style = {
  margin: 12,
};

const LoginComponent = props => (
  <div className="login">
    <h2 className="form-login-heading">Login</h2>
    <form
      onSubmit={props.handleSubmit}
      onChange={props.handleChange}
    >
      <TextField
        style={style}
        name="login"
        hintText="login"
        floatingLabelText="login"
        onChange={props.handleChange}
        required
      /><br />
      <TextField
        style={style}
        name="password"
        type="password"
        hintText="password"
        floatingLabelText="password"
        onChange={props.handleChange}
        errorText={props.message}
        required
      /><br />
      <RaisedButton
        style={style}
        type="submit"
        label="LOGIN"
        primary
      />
    </form>
    <Link to="/signup">Sign up ?</Link><br />
    <Link to="/forgot">Forgot password ?</Link>
  </div>
);

LoginComponent.PropTypes = {
  message: PropTypes.string.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

export default LoginComponent;

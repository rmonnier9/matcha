import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
// import LinearProgress from 'material-ui/LinearProgress';

const style = {
  margin: 12,
};

const stylePaper = {
  height: 500,
  width: 400,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const LoginComponent = props => (
  <Paper style={stylePaper} zDepth={1}>
    <form
      onSubmit={props.handleSubmit}
      onChange={props.handleChange}
    >
      <div>
        <h2 className="form-login-heading">Sign in</h2>
        <p>to continue to matcha</p>
      </div>
      <div role="presentation">
        <div>
          <TextField
            style={style}
            name="login"
            floatingLabelText="Login"
            onChange={props.handleChange}
            required
          /><br />
          <TextField
            style={style}
            name="password"
            type="password"
            floatingLabelText="Password"
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
        </div>
        <div>
          <Link to="/signup">Sign up ?</Link><br />
          <Link to="/forgot">Forgot password ?</Link>
        </div>
      </div>
    </form>
  </Paper>
);

LoginComponent.PropTypes = {
  message: PropTypes.string.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

export default LoginComponent;

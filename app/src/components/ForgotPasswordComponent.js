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

const ForgotPasswordComponent = props => (
  <Paper style={stylePaper} zDepth={1}>
    <form
      onSubmit={props.handleSubmit}
    >
      <div>
        <h2 className="form-login-heading">Get a new password</h2>
      </div>
      <div role="presentation">
        <div>
          <TextField
            style={style}
            name="login"
            floatingLabelText="Login"
            value={props.login}
            onChange={props.updateLogin}
            required
          /><br />
          <TextField
            style={style}
            floatingLabelText="Email"
            value={props.email}
            onChange={props.updateEmail}
            errorText={props.message}
            required
          /><br />
          <RaisedButton
            style={style}
            type="submit"
            label="GET A NEW PASSWORD"
            primary
          />
        </div>
        <div>
          <div>{props.error || props.message}</div>
          <Link to="/login">Back to login</Link>
        </div>
      </div>
    </form>
  </Paper>
);

ForgotPasswordComponent.PropTypes = {
  message: PropTypes.string.required,
  error: PropTypes.string.required,
  handleSubmit: PropTypes.func.required,
  updateEmail: PropTypes.func.required,
  updateLogin: PropTypes.func.required,
};

export default ForgotPasswordComponent;

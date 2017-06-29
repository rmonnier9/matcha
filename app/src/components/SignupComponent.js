import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import ErrorDisplayer from '../components/ErrorDisplayer';

const style = {
  margin: 12,
};

const SignupComponent = props => (
  <div className="signin">
    <h2 className="form-signin-heading">Sign up</h2>
    <form
      onSubmit={props.handleSubmit}
      onChange={props.handleChange}
    >
      <SelectField
        floatingLabelText="I'm a"
        value={props.gender}
        onChange={props.updateGender}
      >
        <MenuItem value={'male'} primaryText="dude" />
        <MenuItem value={'female'} primaryText="girl" />
      </SelectField><br />
      <TextField
        style={style}
        type="email"
        name="email"
        hintText="email"
        floatingLabelText="email"
        onChange={props.handleChange}
        required
      /><br />
      <TextField
        style={style}
        name="firstname"
        hintText="firstname"
        floatingLabelText="firstname"
        onChange={props.handleChange}
        required
      /><br />
      <TextField
        style={style}
        name="lastname"
        hintText="lastname"
        floatingLabelText="lastname"
        onChange={props.handleChange}
        required
      /><br />
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
        type="password"
        name="password"
        hintText="enter your password"
        floatingLabelText="enter your password"
        onChange={props.handleChange}
        required
      /><br />
      <TextField
        style={style}
        type="password"
        name="confirmpassword"
        hintText="confirm your password"
        floatingLabelText="confirm your password"
        onChange={props.handleChange}
        required
      /><br />
      <RaisedButton
        style={style}
        type="submit"
        label="SIGN UP"
        primary
      />
    </form>
    <ErrorDisplayer
      error={props.error}
    />
    <Link to="/login">Already member ?</Link>
  </div>
  );

SignupComponent.PropTypes = {
  error: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    message: PropTypes.string,
  })),
  gender: PropTypes.string.required,
  updateGender: PropTypes.func.required,
  handleSubmit: PropTypes.func.required,
  handleChange: PropTypes.func.required,
};

SignupComponent.defaultProps = {
  error: [],
};

export default SignupComponent;

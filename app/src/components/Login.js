import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions';

export default connect(
  ({ auth: { isAuthenticated, message } }) => ({
    isAuthenticated,
    message,
  }),
)(
class Login extends Component {

  state = {
    login: '',
    password: '',
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleClick = (event) => {
    event.preventDefault();
    const { login, password } = this.state;
    const creds = {
      login: login.trim(),
      password: password.trim(),
    };
    this.props.dispatch(loginUser(creds));
  }

  render() {
    const { isAuthenticated, message } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (isAuthenticated) {
      return (
        <Redirect to={from} />
      );
    }

    return (
      <div className="login">
        <h2 className="form-login-heading">Login</h2>
        <form onSubmit={this.handleClick} onChange={this.handleChange}>
          <input
            type="text"
            className="form-control"
            placeholder="Login"
            required
            name="login"
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            required
            name="password"
          />
          <input type="submit" name="submit" value="Login" />
        </form>

        {message &&
          <p>{message}</p>
        }
        <Link to="/signup">Sign up ?</Link>
        <Link to="/forgot">Forgot password ?</Link>
      </div>
    );
  }
})

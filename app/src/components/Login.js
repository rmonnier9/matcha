import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions';

class Login extends Component {
  handleClick = (event) => {
    event.preventDefault();
    const { login, password } = this;
    const creds = {
      login: login.value.trim(),
      password: password.value.trim(),
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
        <form onSubmit={event => this.handleClick(event)}>
          <input type="text" ref={(c) => { this.login = c; }} className="form-control" placeholder="Login" required />
          <input type="password" ref={(c) => { this.password = c; }} className="form-control" placeholder="Password" required />
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
}

const mapStateToProps = (state) => {
  const { auth } = state;
  const { isAuthenticated, message } = auth;

  return {
    isAuthenticated,
    message,
  };
};

export default connect(mapStateToProps)(Login);

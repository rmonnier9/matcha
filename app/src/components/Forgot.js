import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions';

class Login extends Component {
  handleClick = (event) => {
    event.preventDefault();
    const { login, password } = this.refs;
    const creds = {
      login: login.value.trim(),
      password: password.value.trim(),
    };
    this.props.dispatch(loginUser(creds));
  }

  render() {
    const { isAuthenticated, errorMessage } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (isAuthenticated) {
      return (
        <Redirect to={from} />
      );
    }

    return (
      <div className="signup">
        <h2 className="form-signup-heading">Sign up</h2>
        <form onSubmit={event => this.handleClick(event)}>
          <input type="text" ref="login" className="form-control" placeholder="Login" required />
          <input type="password" ref="password" className="form-control" placeholder="Password" required />
          <input type="submit" name="submit" value="Login" />
        </form>

        {errorMessage &&
          <p>{errorMessage}</p>
        }
        <Link to="/signup">Sign up ?</Link>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  const { isAuthenticated, errorMessage } = auth;

  return {
    isAuthenticated,
    errorMessage,
  };
};

export default connect(mapStateToProps)(Login);

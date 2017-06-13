import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ForgotPassword extends Component {
  state = {
    error: '',
    message: '',
    login: '',
    email: '',
  };

  handleClick = (event) => {
    event.preventDefault();
    const url = '/api/forgot_password';
    const { login, email } = this.state;

    axios({ url, method: 'POST', data: { login, email } })
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({
          error: '',
          message: 'New password sent, please check your email !',
          login: '',
          email: '',
        });
      }
    });
  }

  updateLogin = e => this.setState({ login: e.target.value })
  updateEmail = e => this.setState({ email: e.target.value })

  render() {
    const { error, message, login, email } = this.state;

    return (
      <div className="myprofileform">
        <h1>Get a new password</h1>
        <form onSubmit={this.handleClick}>
          <div>
            <input
              type="text"
              name="login"
              value={login}
              onChange={this.updateLogin}
              className="login"
              placeholder="login"
            />
          </div>
          <div>
            <input
              type="text"
              name="email"
              value={email}
              onChange={this.updateEmail}
              className="email"
              placeholder="email"
            />
            <input type="submit" value="Get a new password" />
          </div>
        </form>
        <div>{error || message}</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }
}

export default ForgotPassword;

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      message: '',
      login: '',
      email: '',
      confirmed: false,
    };
  }

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
        this.setState({ error: '', message: 'New password sent, please check your email !' });
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
              placeholder="login"
              className="login"
              onChange={this.updateLogin}
              value={login}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="email"
              className="email"
              onChange={this.updateEmail}
              value={email}
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class ForgotPassword extends Component {
  state = {
    error: '',
    message: '',
    login: '',
    email: '',
    confirmed: false,
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
        this.setState({ error: '', message: 'New password sent, please check your email !' });
      }
    });
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  render() {
    const { error, message } = this.state;

    return (
      <div className="myprofileform">
        <h1>Get a new password</h1>
        <form onSubmit={this.handleClick} onChange={this.handleChange}>
          <div>
            <input
              type="text"
              name="login"
              className="login"
              placeholder="login"
            />
          </div>
          <div>
            <input
              type="text"
              name="email"
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

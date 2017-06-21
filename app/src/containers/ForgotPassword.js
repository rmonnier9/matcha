import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ForgotPasswordComponent from '../components/ForgotPasswordComponent';
import axios from 'axios';

class ForgotPassword extends Component {
  state = {
    error: '',
    message: '',
    login: '',
    email: '',
  };

  handleSubmit = (event) => {
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
        <ForgotPasswordComponent
          handleSubmit={this.handleSubmit}
          updateLogin={this.updateLogin}
          updateEmail={this.updateEmail}
          email={email}
          login={login}
          error={error}
          message={message}
        />
      </div>
    );
  }
}

export default ForgotPassword;

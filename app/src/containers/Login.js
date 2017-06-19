import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { loginUser } from '../actions/authAction';
import LoginComponent from '../components/LoginComponent';

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

  handleSubmit = (event) => {
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
      isAuthenticated ?
        <Redirect to={from} /> :
        <LoginComponent
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          message={message}
        />
    );
  }
});

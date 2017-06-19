import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import SignupComponent from '../components/SignupComponent';

import { loginUser } from '../actions/authAction';

class Signup extends Component {
  state = {
    error: [],
    gender: '',
    email: '',
    firstname: '',
    lastname: '',
    login: '',
    password: '',
    confirmpassword: '',
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })
  updateGender = (event, index, value) => this.setState({ gender: value })
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      gender,
      email,
      firstname,
      lastname,
      login,
      password,
      confirmpassword,
    } = this.state;
    const data = {
      gender,
      email: email.trim(),
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      login: login.trim(),
      password,
      confirmpassword,
    };
    const url = '/api/signup/';
    axios({ url, method: 'POST', data })
    .then(({ data: { error } }) => {
      if (!error) {
        this.props.dispatch(loginUser({
          login: login.trim(),
          password: password.trim(),
        }));
        this.props.history.push('/');
      } else {
        this.setState({ error });
      }
    });
  }

  render() {
    const { gender, error } = this.state;
    return (
      <SignupComponent
        gender={gender}
        updateGender={this.updateGender}
        handleSubmit={this.handleSubmit}
        handleChange={this.handleChange}
        error={error}
      />
    );
  }
}

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = ({ auth: { isAuthenticated, message } }) => ({
  isAuthenticated,
  message,
});

export default connect(mapStateToProps)(Signup);

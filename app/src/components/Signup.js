import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { loginUser } from '../actions';

class Signup extends Component {
  state = {
    message: '',
  }


  handleClick = (event) => {
    event.preventDefault();
    const { email, firstname, lastname, login, password, confirmpassword } = this;
    const data = {
      email: email.value.trim(),
      firstname: firstname.value.trim(),
      lastname: lastname.value.trim(),
      login: login.value.trim(),
      password: password.value.trim(),
      confirmpassword: confirmpassword.value.trim(),
    };
    const url = '/api/signup/';
    axios({ url, method: 'POST', data })
    .then((json) => {
      const { success } = json.data;
      if (success === true) {
        this.props.dispatch(loginUser({
          login: login.value.trim(),
          password: password.value.trim(),
        }));
        this.props.history.push('/');
      } else {
        this.setState({ message: data.error[0].message });
      }
    });
  }

  render() {
    const { message } = this.state;
    return (
      <div className="signin">
        <h2 className="form-signin-heading">Sign up</h2>
        <form onSubmit={event => this.handleClick(event)}>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" ref={(c) => { this.email = c; }} className="form-control" placeholder="Email address" required />
          <label htmlFor="inputFirstname" className="sr-only">Firstname</label>
          <input type="login" ref={(c) => { this.firstname = c; }} className="form-control" placeholder="Firstname" required />
          <label htmlFor="inputLastname" className="sr-only">Lastname</label>
          <input type="login" ref={(c) => { this.lastname = c; }} className="form-control" placeholder="Lastname" required />
          <label htmlFor="inputLogin" className="sr-only">Login</label>
          <input type="login" ref={(c) => { this.login = c; }} className="form-control" placeholder="Login" required />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" ref={(c) => { this.password = c; }} className="form-control" placeholder="Password" required />
          <label htmlFor="inputPassword" className="sr-only">Confirm password</label>
          <input type="password" ref={(c) => { this.confirmpassword = c; }} className="form-control" placeholder="Confirm password" required />
          <input type="submit" name="submit" value="Create my profile" />
        </form>
        {message &&
          <p>{message}</p>
        }
        <Link to="/login">Already member ?</Link>
      </div>
    );
  }
}

//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = (state) => {
  const { auth } = state;
  const { isAuthenticated, message } = auth;

  return {
    isAuthenticated,
    message,
  };
};

export default connect(mapStateToProps)(Signup);

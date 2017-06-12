import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { loginUser } from '../actions';

class Signup extends Component {
  state = {
    error: [],
    email: '',
    firstname: '',
    lastname: '',
    login: '',
    password: '',
    confirmpassword: '',
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value })

  handleClick = (event) => {
    event.preventDefault();
    const {
      email,
      firstname,
      lastname,
      login,
      password,
      confirmpassword
    } = this.state;
    const data = {
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
    const { error } = this.state;
    return (
      <div className="signin">
        <h2 className="form-signin-heading">Sign up</h2>
        <form onSubmit={this.handleClick}  onChange={this.handleChange}>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email address"
            required
          />
          <label htmlFor="inputFirstname" className="sr-only">Firstname</label>
          <input
            type="login"
            name="firstname"
            className="form-control"
            placeholder="Firstname"
            required
          />
          <label htmlFor="inputLastname" className="sr-only">Lastname</label>
          <input
            type="login"
            name="lastname"
            className="form-control"
            placeholder="Lastname"
            required
          />
          <label htmlFor="inputLogin" className="sr-only">Login</label>
          <input
            type="login"
            name="login"
            className="form-control"
            placeholder="Login"
            required
          />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            required
          />
          <label htmlFor="inputPassword" className="sr-only">Confirm password</label>
          <input
            type="password"
            name="confirmpassword"
            className="form-control"
            placeholder="Confirm password"
            required
          />
          <input type="submit" name="submit" value="Create my profile" />
        </form>
        {error.length !== 0 &&
          <p>{error[0].message}</p>
        }
        <Link to="/login">Already member ?</Link>
      </div>
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

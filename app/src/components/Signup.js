import React, {Component}		from 'react'
import { Link }					from 'react-router-dom'
import { connect }				from 'react-redux'
import axios						from 'axios'

import { loginUser }				from '../actions'

class Signup extends Component {
	state = {
		errorMessage: ''
	}

	render() {
		const {errorMessage} = this.state
		return (
			<div className="signin">
				<h2 className="form-signin-heading">Sign up</h2>
				<form onSubmit={(event) => this.handleClick(event)}>
					<label htmlFor="inputEmail" className="sr-only">Email address</label>
					<input type="email" ref="email" className="form-control" placeholder="Email address" required autoFocus/>
					<label htmlFor="inputFirstname" className="sr-only">Firstname</label>
					<input type="login" ref="firstname" className="form-control" placeholder="Firstname" required/>
					<label htmlFor="inputLastname" className="sr-only">Lastname</label>
					<input type="login" ref="lastname" className="form-control" placeholder="Lastname" required/>
					<label htmlFor="inputLogin" className="sr-only">Login</label>
					<input type="login" ref="login" className="form-control" placeholder="Login" required/>
					<label htmlFor="inputPassword" className="sr-only">Password</label>
					<input type="password" ref="password" className="form-control" placeholder="Password" required/>
					<label htmlFor="inputPassword" className="sr-only">Confirm password</label>
					<input type="password" ref="confirmpassword" className="form-control" placeholder="Confirm password" required/>
					<input type="submit" name="submit" value="Signup"/>
				</form>
				{errorMessage &&
		        <p>{errorMessage}</p>
		      }
				<Link to="/login">Already member ?</Link>
			</div>
		)
	}

  handleClick = (event) => {
	  event.preventDefault()
		const {email, firstname, lastname, login, password, confirmpassword} = this.refs
		const data = {
								email: email.value.trim(),
								firstname: firstname.value.trim(),
								lastname: lastname.value.trim(),
								login: login.value.trim(),
								password: password.value.trim(),
								confirmpassword: confirmpassword.value.trim()
							}
		const url = '/api/signup/'
		axios({url, method: 'POST', data})
		.then(({ data }) => {
		  if (data.success === true) {
			  this.props.dispatch(loginUser(data))
			  this.props.history.push('/')
		  }
		  else {
			  this.setState({errorMessage: data.error[0].message})
		  }
		})
  }
}

const mapStateToProps = (state) => {
  const { auth } = state
  const { isAuthenticated, errorMessage } = auth

  return {
    isAuthenticated,
    errorMessage
  }
}

export default connect(mapStateToProps)(Signup)

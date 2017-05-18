import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { loginUser, logoutUser } from '../actions'
import axios from 'axios'
import { connect } from 'react-redux'

class Signup extends Component {
	state = {
		errorMessage: ''
	}

	render() {
		return (
			<div className="signin">
				<h2 className="form-signin-heading">Sign up</h2>
				<label htmlFor="inputEmail" className="sr-only">Email address</label>
				<input type="email" ref="email" className="form-control" placeholder="Email address" required="" autoFocus={true}/>
				<label htmlFor="inputLogin" className="sr-only">Login</label>
				<input type="login" ref="login" className="form-control" placeholder="Login" required="" autoFocus=""/>
				<label htmlFor="inputPassword" className="sr-only">Password</label>
				<input type="password" ref="password" className="form-control" placeholder="Password" required=""/>
				<label htmlFor="inputPassword" className="sr-only">Confirm password</label>
				<input type="password" ref="confirmpassword" className="form-control" placeholder="Confirm password" required=""/>
				<button onClick={(event) => this.handleClick(event)} className="btn btn-primary">
				  Signup
				</button>
				<Link to="/login">Already member ?</Link>
				<p>{this.state.errorMessage}</p>
			</div>
		)
	}

  handleClick = (event) => {
		const {email, login, password, confirmpassword} = this.refs
		const creds = {
								email: email.value.trim(),
								login: login.value.trim(),
								password: password.value.trim(),
								confirmpassword: confirmpassword.value.trim()
							}
		const url = '/api/signup/'
		console.log("OK");
		console.log({url, method: 'POST', data: {...creds}});
		axios({url, method: 'POST', data: {...creds}})
		.then(({ data }) => {
			console.log(data);
		  if (data.success === true) {
			  this.props.dispatch(loginUser(creds))
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

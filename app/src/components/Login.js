import React, { Component, PropTypes } from 'react'
import {
	Redirect
} from 'react-router-dom'
import { loginUser, logoutUser } from '../actions'
import { connect } from 'react-redux'

class Login extends Component {
	render() {
		const { dispatch, isAuthenticated, errorMessage } = this.props
		const { from } = this.props.location.state || { from: { pathname: '/' } }

		if (isAuthenticated) {
			return (
				<Redirect to={from}/>
			)
		}

     return (
       <div>
         <input type='text' ref='login' className="form-control" placeholder='Login'/>
         <input type='password' ref='password' className="form-control" placeholder='Password'/>
         <button onClick={(event) => this.handleClick(event)} className="btn btn-primary">
           Login
         </button>

         {errorMessage &&
           <p>{errorMessage}</p>
         }
       </div>
     )
   }

   handleClick(event) {
     const login = this.refs.login
     const password = this.refs.password
     const creds = { login: login.value.trim(), password: password.value.trim() }
     this.props.dispatch(loginUser(creds))
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

export default connect(mapStateToProps)(Login)

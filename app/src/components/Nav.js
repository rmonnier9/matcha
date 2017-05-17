import React, {Component} from 'react'
import { connect } from 'react-redux'
import { logoutUser} from '../actions'

import { Link } from 'react-router-dom'

class Nav extends Component {

	render() {
		const { isAuthenticated } = this.props

		if (!isAuthenticated)
			return (
				<nav className="nav">
					<Link to="/login">Login</Link>
					<Link to="/signup">Signup</Link>
				</nav>
			)
		return (
			<nav className="nav">
				<Link to="/">Around me</Link>
				<Link to="/matches">My matches</Link>
				<Link to="/notifications">Notifications</Link>
				<Link to="/search">Search</Link>
				<Link to="/myprofile">My Profile</Link>
				<button onClick={(event) => this.handleClick(event)} className="btn btn-primary">
	           Logout
	         </button>
			</nav>
		)
	}

	handleClick(event) {
	  this.props.dispatch(logoutUser())
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

export default connect(mapStateToProps)(Nav)

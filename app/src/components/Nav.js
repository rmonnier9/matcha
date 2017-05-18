import React, {Component} from 'react'

import { Link } from 'react-router-dom'

class Nav extends Component {

	render() {
		return (
			<nav className="nav">
				<Link to="/">Around me</Link>
				<Link to="/matches">My matches</Link>
				<Link to="/notifications">Notifications</Link>
				<Link to="/search">Search</Link>
				<Link to="/myprofile">My Profile</Link>
				<button onClick={(event) => this.props.handleClick(event)} className="btn btn-primary">
	           Logout
	         </button>
			</nav>
		)
	}
}

export default Nav

import React, {Component} from 'react'
import { connect } from 'react-redux'
import { logoutUser} from '../actions'

import Nav from './Nav.js'

class Header extends Component {

	render() {
		const { isAuthenticated } = this.props
		return (
			<header className="header">
				{isAuthenticated &&
					<Nav
						handleClick={this.handleClick}
					/>
				}
			</header>
		)
	}
	handleClick = (event) => {
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

export default connect(mapStateToProps)(Header)

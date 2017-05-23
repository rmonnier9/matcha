import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom'

// Containers
import Header from './components/Header.js'
import Footer from './components/Footer.js'
import ProfileContainer from './components/ProfileContainer.js'
import MyProfileContainer from './components/MyProfileContainer.js'
import Suggestions from './components/Suggestions.js'
import Matches from './components/Matches.js'
import Notifications from './components/Notifications.js'
import SearchContainer from './components/SearchContainer.js'
import ChatContainer from './components/ChatContainer.js'
import Signup from './components/Signup.js'
import Login from './components/Login.js'
import NotFound from './components/NotFound.js'
import PrivateRoute from './PrivateRoute'

class MatchaRouter extends Component {
	render() {
		const { isAuthenticated } = this.props

		return (
			<Router>
				<div>
					<Header />
					<Switch>
						<PrivateRoute exact path="/" isAuthenticated={isAuthenticated} component={Suggestions} />
						<PrivateRoute path="/matches" isAuthenticated={isAuthenticated} component={Matches} />
						<PrivateRoute path="/notifications" isAuthenticated={isAuthenticated} component={Notifications} />
						<PrivateRoute path="/search" isAuthenticated={isAuthenticated} component={SearchContainer} />
						<PrivateRoute path="/profile/:login" isAuthenticated={isAuthenticated} component={ProfileContainer} />
						<PrivateRoute path="/myprofile" isAuthenticated={isAuthenticated} component={MyProfileContainer} />
						<PrivateRoute path="/chat/:login" isAuthenticated={isAuthenticated} component={ChatContainer} />
						<Route path="/login" component={Login} />
						<Route path="/signup" component={Signup} />
						<Route component={NotFound} />
					</Switch>
					<Footer />
				</div>
			</Router>
		)
	}
}

MatchaRouter.propTypes = {
}

const mapStateToProps = (state) => {
  const { auth } = state
  const { isAuthenticated } = auth

  return {
    isAuthenticated
  }
}

export default connect(mapStateToProps)(MatchaRouter)

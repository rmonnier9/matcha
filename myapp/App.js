import React from 'react'
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'

import './App.css'

// Containers
import Header from './Header.js'
import Footer from './Footer.js'
import Profile from './Profile.js'
import Around from './Around.js'
import Matches from './Matches.js'
import Notifications from './Notifications.js'
import Search from './Search.js'
import Signup from './Signup.js'
import Signin from './Signin.js'

const App = () => (
	<Router>
		<div>
			<Header />
			<Route exact path="/" component={Around} />
			<Route path="/matches" component={Matches} />
			<Route path="/notifications" component={Notifications} />
			<Route path="/search" component={Search} />
			<Route path="/profile" component={Profile} />
			<Route path="/signin" component={Signin} />
			<Route path="/signup" component={Signup} />
			<Footer />
		</div>
	</Router>
)

export default App

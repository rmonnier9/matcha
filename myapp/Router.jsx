 // import React, { Component } from 'react'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'


// Containers
import MainLayout from './containers/MainLayout.jsx'
import Home from './containers/Home.jsx'
import Search from './containers/Search.jsx'
import Profile from './containers/Profile.jsx'
import Signin from './containers/Signin.jsx'
import Signup from './containers/Signup.jsx'

// Pages

export default class RouterMatcha extends React.Component {
	render () {
		return (
			<Router history={browserHistory}>
		     <Route component={MainLayout}>
		       <Route path="/" component={Home} />

		       <Route path="/search" component={Search} />
		       <Route path="/profile" component={Profile} />

		       <Route path="/signin">
		         <Route component={Signin} />
		       </Route>
				 <Route path="/signup">
				   <Route component={Signup}/>
				 </Route>

		     </Route>
		  </Router>
		)
	}
}

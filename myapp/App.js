import {
	BrowserRouter as Router,
	Route,
	NavLink
} from 'react-router-dom'

import './App.css'

// Containers
// import MainLayout from './containers/MainLayout.jsx'
// import Home from './containers/Home.jsx'
// import Search from './containers/Search.jsx'
// import Profile from './containers/Profile.jsx'
// import Signin from './containers/Signin.jsx'
// import Signup from './containers/Signup.jsx'

// Pages
const Links = () => (
	<nav>
		<NavLink exact activeClassName="active" to="/">Home</NavLink>
		<NavLink activeClassName="active" to="/about"}}>Around me</NavLink>
		<NavLink activeClassName="active" to="/contact">Search</NavLink>
		<NavLink activeClassName="active" to="/profile">Profile</NavLink>
		<NavLink activeClassName="active" to="/signin">Signin</NavLink>
		<NavLink activeClassName="active" to="/signup">Signup</NavLink>
	</nav>
)

const App = () => (
	<Router>
		<div>
			<Links />
			<Route exact path="/" render={() => <h1>Home</h1>} />
			<Route path="/around" render={() => <h1>Around me</h1>} />
			<Route path="/search" render={() => <h1>Search</h1>} />
			<Route path="/profile" render={() => <h1>Profile</h1>} />
			<Route path="/signin" render={() => <h1>Signin</h1>} />
			<Route path="/signup" render={() => <h1>Signup</h1>} />
		</div>
	</Router>
)

export default App

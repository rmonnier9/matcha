Three different way of giving the children
<Router>
	<div>
		<Route exact path="/" component={Home} />
		<Route path="/about" render={() => <h1>About</h1>} />
		<Route strict path="/contact/" render={() => <h1>About</h1>} />
		<Route
			path="/about"
			children={({match}) => match && <h1>About</h1>} />
	</div>
</Router>

Two ways of creating links and replace options (modify browser history)
<nav>
	<Link to="/">Home</Link>
	<Link to={{pathname: '/about'}}>About</Link>
	<Link replace to="/contact">Contact</Link>
</nav>

Styling the links : class "active" given on condition
const Links = () => (
	<nav>
		<NavLink exact activeClassName="active" to="/">Home</NavLink>
		<NavLink activeStyle={{color: 'green'}} to={{pathname: '/about'}}>About</NavLink>
		<NavLink
			isActive={isActiveFunc}
			activeClassName="active"
			to="/contact">Contact</NavLink>
	</nav>
)

URL parameters
<Router>
	<div>
		<Route path="/:page?-:subpage?" render={({match}) => (
			<h1>
				PAGE: {match.params.page || "Home"}<br />
			SUBPAGE: {match.params.subpage}<br />
			</h1>
		)} />
	</div>
</Router>

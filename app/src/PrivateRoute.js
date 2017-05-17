import React from 'react'
import PropTypes from 'prop-types'
import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect
} from 'react-router-dom'

const PrivateRoute = ({ component: Component, isAuthenticated: isAuthenticated, ...rest }) => (
  <Route {...rest} render={props => (
    (null && console.log(rest)) || isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired
}

export default PrivateRoute

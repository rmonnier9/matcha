import React, { Component } from 'react'
import {
	Redirect
} from 'react-router-dom'
import { logoutUser } from './actions'

class Logout extends Component {
	render() {
		const { isAuthenticated } = this.props
		const { from } = this.props.location.state || { from: { pathname: '/' } }

     return (
       <div>
         <button onClick={(event) => this.handleClick(event)} className="btn btn-primary">
           Logout
         </button>
       </div>
     )
   }

   handleClick(event) {
     this.props.dispatch(logoutUser())
   }
}


export default Logout

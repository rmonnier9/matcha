import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import EncartLeft from './EncartLeft.js'

class UsersList extends Component {
	render() {
		if (this.props.users.length === 0)
			return (<div>No Users found</div>)
		return (
			<div className='users-list'>
				{
					this.props.users.map((user, i) => {
						const {login} = user
						const url = "/profile/" + login
						return (
							 <div key={i} className="user">
								 <Link to={url}>{login}</Link>
								 <EncartLeft
									 profile={user}
								 />
							 </div>
						)
					  })
				}
			</div>
		)
	}
}

export default UsersList

import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import EncartLeft from './EncartLeft.js'

class UsersList extends Component {
	render() {
		const { users, serverResponse } = this.props
		console.log(users, serverResponse);
		let usersList = null;
		if (users) {
			usersList = users.map((user, key) => {
				const url = "/profile/" + user.login
				console.log(user);
				return (
					<li key={key} className="users" >
						<Link to={url}>{user.login}</Link>
						<EncartLeft
							profile={user}
						/>
					</li>
				)
			})
		}
		else {
			usersList = <p>No Users found</p>
		}
		return (
			<div className="users-list">
				{usersList}
			</div>
		)
	}
}

export default UsersList

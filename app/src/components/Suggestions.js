import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import callApi from '../callApi.js'
import UsersList from './UsersList.js'
import EncartLeft from './EncartLeft.js'
import { Link } from 'react-router-dom'

class Suggestions extends Component {
	constructor(props) {
		super(props)
		const { search } = this.props.location
		this.state = {
			users: [],
			errorMessage: ""
		}
	}

	componentDidMount() {
		const url = "/suggestions"
		callApi(url, 'GET')
		.then(json => {
			console.log(json);
			const {data} = json
			const {users, message} = data
			if (!data.success)
				this.setState({errorMessage: message})
			else
				this.setState({users})
		})
		.catch(err => {console.log("log error :", err);})
	}

	render() {
		console.log("RENDER", this.state);
		const {serverResponse, data, users} = this.state

		const items = []
		console.log("users", users);
		if (!users.length) items.push(<p key={0}>No results</p>)
		else {
			users.map((user, key) => {
				const {login} = user
				const url = "/profile/" + login
				 items.push(
	 					<li key={key} className="users" >
	 						<Link to={url}>{login}</Link>
	 						<EncartLeft
	 							profile={user}
	 						/>
	 					</li>
				 )
			})
		}
		return (
			<div className="suggestions">
				<h2>Suggestions :</h2>
				<div className="users">
					{items}
				</div>
			</div>
		)
	}
}

export default Suggestions

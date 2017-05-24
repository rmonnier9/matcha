import React, { Component } 	from 'react'
import { Link }					from 'react-router-dom'
import InfiniteScroll			from 'react-infinite-scroller'

import callApi from '../callApi.js'
import UsersList from './UsersList.js'
import EncartLeft from './EncartLeft.js'

class Matches extends Component {
	constructor(props) {
		super(props)
		const { search } = this.props.location
		this.state = {
			serverResponse: null,
			data: null,
			users: [],
			usersProfile: [],
			hasMoreItems: true,
			nextHref: null
		}
	}

	componentDidMount() {
		const url = "/myprofile"
		callApi(url, 'GET')
		.then(json => {
			console.log(json);
			const {data} = json
			const {profile, message} = data
			if (!data.success)
				this.setState({errorMessage: message})
			else
				this.setState({users: profile.matches})
		})
		.catch(err => {console.log("log error :", err);})
	}

	loadItems = page => {
		const { usersProfile, users } = this.state
		const { pathname, search } = this.props.location
		let index = 0;
		if (this.state.nextHref) {
			  index = this.state.nextHref;
		}
		if (!users.length) return ;
		const url = "/profile/" + users[index]
		 callApi(url, 'GET')
		 .then(json => {
			 console.log("first api request", json);
			 const {data} = json
			 const usersProfile = [...this.state.usersProfile, data.profile]
			 console.log("test", users.length, index + 1);
			 if (users.length < index + 1) {
				 this.setState({
					 usersProfile,
					 nextHref: index + 1
				 })
			 } else {
				 this.setState({
					 usersProfile,
					 hasMoreItems: false
				 })
			 }
		 })
 	}

	render() {
		console.log("RENDER", this.state);
		const {serverResponse, data, usersProfile} = this.state

		const items = []
		console.log("users", usersProfile);
		if (!usersProfile.length) items.push(<p key={0}>No results</p>)
		else {
			usersProfile.map((user, key) => {
				const {login} = user
				const url = "/profile/" + login
				const chatUrl = "/chat/" + login
				 items.push(
	 					<li key={key} className="users" >
	 						<Link to={url}>{login}</Link>
	 						<EncartLeft
	 							profile={user}
	 						/>
							<Link to={chatUrl}>Go to chat
							</Link>
	 					</li>
				 )
			})
		}
		const loader = <div className="loader">Loading ...</div>;

		return (
			<div className="mymatches">
				<h2>My matches</h2>
				<InfiniteScroll
					pageStart={0}
					loadMore={this.loadItems}
					hasMore={this.state.hasMoreItems}
					loader={loader}>

					<div className="users">
						{items}
					</div>
				</InfiniteScroll>
			</div>
		)
	}
}

export default Matches

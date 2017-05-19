import React, {Component} from 'react'
import callApi from '../callApi.js'
import UsersList from './UsersList.js'
import InfiniteScroll from 'react-infinite-scroller'
import EncartLeft from './EncartLeft.js'
import { Link } from 'react-router-dom'


class Matches extends Component {
	constructor(props) {
		super(props)
		const { search } = this.props.location
		this.state = {
			serverResponse: null,
			data: null,
			users: [],
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
		const { ageVal, popVal, tagVal, distVal, users } = this.state
		const { pathname, search } = this.props.location
		let index = 0;
		if (this.state.nextHref) {
			  index = this.state.nextHref;
		}
		const url = "/profile/" + users[index]
		 callApi(url, 'GET')
		 .then(json => {
			 console.log(json);
			 const {data} = json
			 const usersProfile = [...this.state.usersProfile, data.profile]

			 if (users.length < index + 1) {
				 this.setState({
					 hasMoreItems: false
				 })
			 } else {
				 this.setState({
					 users: users,
					 nextHref: data.nextHref
				 })
			 }
		 })
 	}

	loadItems = page => {
		const { ageVal, popVal, tagVal, distVal } = this.state
		const { pathname, search } = this.props.location
		const url =
		callApi(url, 'GET').then(json => {
			console.log(json);
			const {data} = json
			const users = [...this.state.users]

			data.users.map(user => {
				 users.push(user);
			})

			if (data.nextHref) {
				 this.setState({
					  users: users,
					  nextHref: data.nextHref
				 })
			} else {
				 this.setState({
					  hasMoreItems: false
				  })
			}
		})
		//  callApi(url, 'GET').then(json => {
		// 	 console.log(json);
		// 	 const {data} = json
		// 	 const users = [...this.state.users]
		 //
		// 	 data.users.map(user => {
		// 		  users.push(user);
		// 	 })
		 //
		// 	 if (data.nextHref) {
		// 		  this.setState({
		// 				users: users,
		// 				nextHref: data.nextHref
		// 		  })
		// 	 } else {
		// 		  this.setState({
		// 				hasMoreItems: false
		// 			})
		// 	 }
		//  })
 	}

	render() {
		console.log("RENDER", this.state);
		const {serverResponse, data, users} = this.state

		const items = []
		console.log(users);
		if (!users.length) items.push(<p key={0}>No results</p>)
		else {
			users.map((user, key) => {
				const url = "/profile/" + user.login
				 items.push(
	 					<li key={key} className="users" >
	 						<Link to={url}>{user.login}</Link>
	 						<EncartLeft
	 							profile={user}
	 						/>
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

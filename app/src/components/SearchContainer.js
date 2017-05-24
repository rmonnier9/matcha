import React, { Component }	from 'react'
import InfiniteScroll			from 'react-infinite-scroller'
import { Link }					from 'react-router-dom'
import queryString				from 'query-string'

import callApi 					from '../callApi.js'

import EncartLeft 				from './EncartLeft.js'
import UsersList 					from './UsersList.js'
import SearchParams				from './SearchParams.js'

class SearchContainer extends Component {
	constructor(props) {
		super(props)
		const { search } = this.props.location
		const query = queryString.parse(search)
		this.state = {
			serverResponse: null,
			name: query.name,
			ageVal: query.age,
			distVal: query.distance,
			popVal: {
				min: 0,
				max: 100,
			},
			data: null,
			users: [],
			hasMoreItems: true,
			nextHref: null
		}
	}

	loadItems = page => {
		const { popVal, nextHref } = this.state
		const { pathname, search } = this.props.location
		let url
		if (!nextHref) {
		  url = pathname + search
		  url += '&popmin=' + popVal.min
		  url += '&popmax=' + popVal.max
		}
		else {
			url = nextHref
		 }
		 callApi(url, 'GET')
		 .then(({ data }) => {
			 const users = [...this.state.users]

			 data.users.map(user => {
				  users.push(user)
			 })

			 if (data.nextHref) {
				  this.setState({
					  users,
					  nextHref: data.nextHref
					})
			 } else {
				  this.setState({
					  users,
					  hasMoreItems: false,
					  nextHref: null
					})
			 }
		 })
 	}

	updateAge = (e) => this.setState({ ageVal: e.target.value })
	updatePop = (value) => this.setState({ popVal: value })
	updateDist = (e) => this.setState({ distVal: e.target.value })
	updateName = (e) => this.setState({ name: e.target.value })

	render() {
		console.log("RENDER", this.state);
		const {serverResponse, ageVal, distVal, popVal, name, data, users} = this.state

		const items = []
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
			<div className="search">
				<h2>Search my soulmate</h2>
				<SearchParams
					onSubmitClick={this.search}
					serverResponse={serverResponse}
					ageVal={ageVal}
					distVal={distVal}
					popVal={popVal}
					name={name}
					updateAge={this.updateAge}
					updateDist={this.updateDist}
					updatePop={this.updatePop}
					updateName={this.updateName}
				/>
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

export default SearchContainer

import React, { Component } from 'react'

import InfiniteScroll from 'react-infinite-scroller'
import EncartLeft from './EncartLeft.js'
import callApi from '../callApi.js'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import UsersList from './UsersList.js'
import SearchParams from './SearchParams.js'

class SearchContainer extends Component {
	constructor(props) {
		super(props)
		const { search } = this.props.location
		console.log(search);
		const query = queryString.parse(search)
		console.log(query);
		this.state = {
			subDis: false,
			subVal: '&nbsp;',
			advanced: false,
			serverResponse: null,
			ageVal: {
				min: 18,
				max: 100,
			},
			popVal: {
				min: 0,
				max: 100,
			},
			distVal: {
				min: 0,
				max: 100,
			},
			tagVal: {
				min: 0,
				max: 100,
			},
			name: query.name,
			data: null,
			users: [],
			hasMoreItems: true,
			nextHref: null
		}
	}

	loadItems = page => {
		const { ageVal, popVal, tagVal, distVal } = this.state
		const { pathname, search } = this.props.location
		let url
		if (this.state.nextHref) {
			  url = this.state.nextHref;
		}
		else {
			url = pathname + search
			url += '&agemin=' + ageVal.min
			url += '&agemax=' + ageVal.max
			url += '&popmin=' + popVal.min
			url += '&popmax=' + popVal.max
			url += '&distmin=' + distVal.min
			url += '&distmax=' + distVal.max
		 }
		 console.log(url);
		 callApi(url, 'GET').then(json => {
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
 	}

	updateAge = (value) => this.setState({ ageVal: value })
	updatePop = (value) => this.setState({ popVal: value })
	updateDist = (value) => this.setState({ distVal: value })
	updateName = (e) => this.setState({ name: e.target.value })

	render() {
		console.log(this.state);
		const {serverResponse, ageVal, distVal, popVal, name, data} = this.state

		const items = []
		this.state.users.map((user, key) => {
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

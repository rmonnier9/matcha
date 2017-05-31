import React, { Component } 	from 'react'
import InfiniteScroll			from 'react-infinite-scroller'

import callApi						from '../callApi.js'
import UsersList					from './UsersList.js'

class InfiniteUsersScroll extends Component {
	state = {
		users: [],
		hasMoreItems: true,
		nextHref: null
	}

	loadItems = page => {
		const { nextHref, hasMoreItems } = this.state
		let url
		if (!nextHref || !hasMoreItems) {
			url = this.props.baseUrl
		}
		else {
			url = nextHref
		}
		callApi(url, 'GET')
		.then(json => {
			const {data} = json
			const users = [...this.state.users, ...data.users]

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

	render() {
		// console.log("RENDER", this.state)
		const {users} = this.state
		const loader = <div className="loader">Loading ...</div>;

		return (
			<InfiniteScroll
				pageStart={0}
				loadMore={this.loadItems}
				hasMore={this.state.hasMoreItems}
				loader={loader}>

				<UsersList
					users={users}
				/>
			</InfiniteScroll>
		)
	}
}

export default InfiniteUsersScroll

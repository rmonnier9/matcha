import React, { Component } 	from 'react'

import InfiniteUsersScroll		from './InfiniteUsersScroll.js'

class Matches extends Component {
	render() {
		return (
			<div className="mymatches">
				<h2>My matches</h2>
				<InfiniteUsersScroll
					baseUrl={"/matches"}
				/>
			</div>
		)
	}
}

export default Matches

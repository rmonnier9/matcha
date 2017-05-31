import React, { Component } 	from 'react'

import InfiniteUsersScroll		from './InfiniteUsersScroll.js'

class Suggestions extends Component {
	render() {
		return (
			<div className="aroundme">
				<h2>Aroundme</h2>
				<InfiniteUsersScroll
					baseUrl={"/suggestions"}
				/>
			</div>
		)
	}
}

export default Suggestions

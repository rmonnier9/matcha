import React, { Component } from 'react'

import callApi from '../callApi.js'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import UsersList from './UsersList.js'
import SearchParams from './SearchParams.js'

class SearchContainer extends Component {
	state = {
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
		data: null
	}

	componentDidMount() {
		const { ageVal, popVal, tagVal, distVal } = this.state
		const { pathname, search } = this.props.location
		let url = pathname + search
		url += '&agemin=' + ageVal.min
		url += '&agemax=' + ageVal.max
		url += '&popmin=' + popVal.min
		url += '&popmax=' + popVal.max
		url += '&distmin=' + distVal.min
		url += '&distmax=' + distVal.max
		callApi(url, 'GET').then(json => {
			const {data} = json
			this.setState({data})
			if (data.status === false) {
				this.setState({ serverResponse: 'AN ERROR OCCURRED' });
			} else {
				if (!data.users.length) {
					this.setState({ serverResponse: 'NO RESULTS FOUND' });
				}
				this.props.setResults(data.more);
			}
		})

	}

	updateAge = (value) => this.setState({ ageVal: value })
	updatePop = (value) => this.setState({ popVal: value })
	updateDist = (value) => this.setState({ distVal: value })

	render() {
		const { pathname, search } = this.props.location
		const query = queryString.parse(search)
		const {name} = query
		query.start = !query.start ? 2 : parseInt(query.start) + 2
		const newSearch = queryString.stringify(query)
		const urlNextPage = pathname + "?" + newSearch
		const {serverResponse, ageVal, distVal, popVal, data} = this.state
		return (
			<div className="search">
				<h2>Search my soulmate</h2>
				<SearchParams
					name={name}
					onSubmitClick={this.search}
					serverResponse={serverResponse}
					ageVal={ageVal}
					distVal={distVal}
					popVal={popVal}
					updateAge={this.updateAge}
					updatePop={this.updatePop}
					updateDist={this.updateDist}
				/>
				{data && data.users &&
					<UsersList
					users={data.users}
					serverResponse={serverResponse}
				/>}
				<Link to={urlNextPage}>Next page</Link>
			</div>
		)
	}
}

export default SearchContainer

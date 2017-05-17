import React, { Component } from 'react'

import callApi from '../callApi.js'

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

	search = (e) => {
		e.preventDefault();
		const { ageVal, popVal, tagVal, distVal } = this.state;
		// const checkedInput = _.filter(e.target.orientation, (el) => el.checked);
		// const orientation = checkedInput.map((el) => el.value);
		this.setState({ serverResponse: null });
		let url = '/search?'
		url += 'name=' + e.target.name.value
		url += '&agemin=' + ageVal.min
		url += '&agemax=' + ageVal.max
		url += '&popmin=' + popVal.min
		url += '&popmax=' + popVal.max
		url += '&distmin=' + distVal.min
		url += '&distmax=' + distVal.max
		url += '&gender=' + e.target.gender.value
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

	updateAge = (value) => this.setState({ ageVal: value });
	updatePop = (value) => this.setState({ popVal: value });
	updateDist = (value) => this.setState({ distVal: value });

	render() {
		const {serverResponse, ageVal, distVal, popVal} = this.state
		return (
			<div className="search">
				<h2>Search my soulmate</h2>
				<SearchParams
					onSubmitClick={this.search}
					serverResponse={serverResponse}
					ageVal={ageVal}
					distVal={distVal}
					popVal={popVal}
					updateAge={this.updateAge}
					updatePop={this.updatePop}
					updateDist={this.updateDist}
				/>
				<UsersList />
			</div>
		)
	}
}

export default SearchContainer

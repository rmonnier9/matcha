import React, { Component } from 'react'
import InputRange				from 'react-input-range'

import 'react-input-range/lib/css/index.css'

const SearchInput = ({ children, label }) =>
	<div className="searchInput">
		<div className="searchLabel">{label}</div>
		{children}
	</div>

class SearchParams extends Component {
	render() {
		const { onSubmitClick, serverResponse, ageVal, popVal, distVal, updateAge, updatePop, updateDist } = this.props
		return (
			<div className="search-params">
		     <form onSubmit={onSubmitClick}>
		 		<div className="errorMessageMain">{serverResponse}</div>
				<div className="label">Name or username</div>
				<input type="text" name="name" />
				<div className="leftSearch">
				<SearchInput label="age">
					<InputRange maxValue={100} minValue={18} value={ageVal} onChange={updateAge} />
				</SearchInput>
				</div>
				<div className="rightSearch">
					<SearchInput label="popularity">
						<InputRange maxValue={100} minValue={0} value={popVal} onChange={updatePop} />
					</SearchInput>
					<SearchInput label="distance (km)">
						<InputRange maxValue={100} minValue={0} value={distVal} onChange={updateDist} />
					</SearchInput>
				</div>
				<input type="submit" value="Find my soulmate!" />
				</form>
			</div>
		)
	}
}

export default SearchParams

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
		const { onSubmitClick, serverResponse, ageVal, popVal, distVal, name,
					updateAge, updatePop, updateDist, updateName } = this.props
		return (
			<div className="search-params">
		     <form method="get" action="#">
		 		<div className="errorMessageMain">{serverResponse}</div>
				<div className="leftSearch">
				<SearchInput label="Name">
					<input type="text" name="name" value={name} onChange={updateName}/>
				</SearchInput>
				<br />
				{/* <SearchInput label="Popularity">
					<br />
					<InputRange maxValue={100} minValue={0} value={popVal} onChange={updatePop} />
				</SearchInput> */}
				<br />
				</div>
				<div className="rightSearch">
					<div hidden={true}>
						<input id="distance" type="radio" name="distance" value="0to15"
							onChange={updateDist}
							checked={"0to15" === distVal}
						/>From 0 to 15km
						<input id="distance" type="radio" name="distance" value="to50"
							onChange={updateDist}
							checked={"to50" === distVal}
						/>Until 50km
						<input id="distance" type="radio" name="distance" value="to150"
							onChange={updateDist}
							checked={"to150" === distVal}
						/>Until 150km
					</div>
					<div>
						<input id="age" type="radio" name="age" value="18to30"
							onChange={updateAge}
							checked={"18to30" === ageVal}
						/>18 to 30 years old
						<input id="age" type="radio" name="age" value="30to50"
							onChange={updateAge}
							checked={"30to50" === ageVal}
						/>30 to 45 years old
						<input id="age" type="radio" name="age" value="from50"
							onChange={updateAge}
							checked={"from50" === ageVal}
						/>45 and beyond
					</div>
				</div>
				<input type="submit" value="Find my soulmate!" />
				</form>
			</div>
		)
	}
}

export default SearchParams

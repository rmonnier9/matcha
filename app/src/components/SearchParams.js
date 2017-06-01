import React, { Component } from 'react';
// import InputRange from 'react-input-range';
//
// import 'react-input-range/lib/css/index.css';

const SearchInput = ({ children, label }) =>
(<div className="searchInput">
  <div className="searchLabel">{label}</div>
  {children}
</div>);

class SearchParams extends Component {
  render() {
    const {
      serverResponse,
      ageVal,
      distVal,
      name,
      updateAge,
      updateDist,
      updateName,
      // popVal,
      // updatePop
    } = this.props;
    return (
      <div className="search-params">
        <form method="get" action="#">
          <div className="errorMessageMain">{serverResponse}</div>
          <div className="leftSearch">
            <SearchInput label="Name">
              <input type="text" name="name" value={name} onChange={updateName} />
            </SearchInput>
            <br />
            {/* <SearchInput label="Popularity">
            <br />
            <InputRange maxValue={100} minValue={0} value={popVal} onChange={updatePop} />
          </SearchInput> */}
            <br />
          </div>
          <div className="rightSearch">
            <div hidden>
            <input
              className="distance" type="radio" name="distance" value="0to15"
              onChange={updateDist}
              checked={distVal === '0to15'}
            />From 0 to 15km
            <input
              className="distance" type="radio" name="distance" value="to50"
              onChange={updateDist}
              checked={distVal === 'to50'}
            />Until 50km
            <input
              className="distance" type="radio" name="distance" value="to150"
              onChange={updateDist}
              checked={distVal === 'to150'}
            />Until 150km
            </div>
            <div>
              <input
                className="age" type="radio" name="age" value="18to30"
                onChange={updateAge}
                checked={ageVal === '18to30'}
              />18 to 30 years old
              <input
                className="age" type="radio" name="age" value="30to50"
                onChange={updateAge}
                checked={ageVal === '30to50'}
              />30 to 45 years old
              <input
                className="age" type="radio" name="age" value="from50"
                onChange={updateAge}
                checked={ageVal === 'from50'}
              />45 and beyond
            </div>
          </div>
          <input type="submit" value="Find my soulmate!" />
        </form>
      </div>
    );
  }
}

export default SearchParams;

import React, { Component } from 'react';
import queryString from 'query-string';

import SearchParams from './SearchParams.js';
import InfiniteUsersScroll from './InfiniteUsersScroll.js';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const query = queryString.parse(search);
    this.state = {
      serverResponse: null,
      name: query.name,
      ageVal: query.age,
      distVal: query.distance,
      popVal: {
        min: 0,
        max: 100,
      },
    };
  }

  updateAge = e => this.setState({ ageVal: e.target.value })
  updatePop = value => this.setState({ popVal: value })
  updateDist = e => this.setState({ distVal: e.target.value })
  updateName = e => this.setState({ name: e.target.value })

  render() {
    // console.log("RENDER", this.state);
    const {
      ageVal,
      distVal,
      popVal,
      name,
      serverResponse,
    } = this.state;

    const { pathname, search } = this.props.location;
    let baseUrl;
    baseUrl = pathname + search;
    baseUrl += `&popmin=${popVal.min}`;
    baseUrl += `&popmax=${popVal.max}`;
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
        {search &&
          <InfiniteUsersScroll
            baseUrl={baseUrl}
          />
        }
      </div>
    );
  }
}

export default SearchContainer;

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
      name: query.name,
      tags: [],
      ageVal: query.age,
      distVal: query.distance,
      popVal: {
        min: 0,
        max: 100,
      },
      message: '',
    };
  }

  updateName = e => this.setState({ name: e.target.value })
  updateAge = e => this.setState({ ageVal: e.target.value })
  updateDist = e => this.setState({ distVal: e.target.value })
  updatePop = value => this.setState({ popVal: value })
  updateTags = tags => this.setState({ tags })

  render() {
    // console.log("RENDER", this.state);
    const {
      name,
      tags,
      ageVal,
      distVal,
      popVal,
      message,
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
          name={name}
          updateName={this.updateName}
          tags={tags}
          updateTags={this.updateTags}
          ageVal={ageVal}
          updateAge={this.updateAge}
          distVal={distVal}
          updateDist={this.updateDist}
          popVal={popVal}
          updatePop={this.updatePop}
          message={message}
          onSubmit={this.onSubmit}
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

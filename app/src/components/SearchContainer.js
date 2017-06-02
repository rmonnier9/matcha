import React, { Component } from 'react';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';

import SearchParams from './SearchParams.js';
import callApi from '../callApi.js';
import UsersList from './UsersList.js';

class SearchContainer extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const query = queryString.parse(search);
    this.state = {
      name: query.name || '',
      tags: [],
      ageVal: query.age,
      distVal: query.distance,
      popVal: {
        min: 0,
        max: 100,
      },
      message: '',
      users: [],
      loadStarted: !!search,
      hasMoreItems: true,
      nextHref: null,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    const {
      name,
      ageVal,
      distVal,
      popVal,
      tags,
    } = this.state;
    const query = {
      name,
      ageVal,
      distVal,
      popmin: popVal.min,
      popmax: popVal.max,
      tags,
    };
    const { pathname } = this.props.location;
    const search = queryString.stringify(query);
    const newUrl = `${pathname}?${search}`;
    this.props.history.push(newUrl);
    this.setState({ users: [],
      hasMoreItems: true,
      nextHref: null,
    });
  }


  getSearchURL = () => {
    const { pathname, search } = this.props.location;
    if (!search) return '';
    return (pathname + search);
  }

  loadItems = () => {
    const { nextHref } = this.state;
    const url = nextHref || this.getSearchURL();
    callApi(url, 'GET')
    .then(({ data }) => {
      const users = [...this.state.users, ...data.users];

      if (data.nextHref) {
        this.setState({
          users,
          nextHref: data.nextHref,
        });
      } else {
        this.setState({
          users,
          hasMoreItems: false,
          nextHref: null,
        });
      }
    });
  }

  updateName = e => this.setState({ name: e.target.value })
  updateAge = e => this.setState({ ageVal: e.target.value })
  updateDist = e => this.setState({ distVal: e.target.value })
  updatePop = value => this.setState({ popVal: value })
  updateTags = tags => this.setState({ tags })


  render() {
    // console.log('RENDER', this.state);
    const {
      name,
      tags,
      ageVal,
      distVal,
      popVal,
      loadStarted,
      hasMoreItems,
      message,
    } = this.state;
    const { users } = this.state;
    const loader = <div className="loader">Loading ...</div>;

    return (
      <div className="search">
        <h2>Search my soulmate</h2>
        <SearchParams
          message={message}
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
          onSubmit={this.onSubmit}
        />
        {loadStarted &&
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={hasMoreItems}
            loader={loader}
          >
            <UsersList
              users={users}
            />
          </InfiniteScroll>
        }
      </div>
    );
  }
}

export default SearchContainer;

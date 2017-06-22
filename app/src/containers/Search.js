import React, { Component } from 'react';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';

import SearchParams from '../components/SearchParams';
import callApi from '../callApi';
import UserList from '../components/UserList';

class Search extends Component {
  constructor(props) {
    super(props);
    const { search } = this.props.location;
    const query = queryString.parse(search);
    this.state = {
      name: query.name || '',
      tags: query.tags || [],
      ageVal: query.age,
      distVal: query.distance,
      popVal: {
        min: parseInt(query.popmin, 10) || 0,
        max: parseInt(query.popmax, 10) || 100,
      },
      sort: query.sort || '',
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
    const sort = event.target.sort.value;
    const query = {
      name,
      ageVal,
      distVal,
      popmin: popVal.min,
      popmax: popVal.max,
      tags,
      sort,
    };
    const { pathname } = this.props.location;
    const search = queryString.stringify(query);
    const newUrl = `${pathname}?${search}`;
    this.props.history.push(newUrl);
    this.setState({ sort,
      users: [],
      hasMoreItems: true,
      nextHref: null,
      loadStarted: true,
    });
  }


  getSearchURL = () => {
    const { pathname, search } = this.props.location;
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
  updateAge = (event, index, value) => this.setState({ ageVal: value })
  updateDist = (event, index, value) => this.setState({ distVal: value })
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
      sort,
      loadStarted,
      hasMoreItems,
      message,
    } = this.state;
    const { users } = this.state;
    const loader = <div className="loader">Loading ...</div>;

    return (
      <div className="search">
        <h2>Search my soulmate</h2>
        <form onSubmit={event => this.onSubmit(event)}>
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
            sort={sort}
            onSubmit={this.onSubmit}
          />
        </form>
        {loadStarted &&
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadItems}
            hasMore={hasMoreItems}
            loader={loader}
          >
            <UserList
              users={users}
            />
          </InfiniteScroll>
        }
      </div>
    );
  }
}

export default Search;

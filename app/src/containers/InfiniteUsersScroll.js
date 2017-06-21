import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import callApi from '../callApi';
import UsersList from '../components/UsersList';

class InfiniteUsersScroll extends Component {
  state = {
    users: [],
    baseUrl: this.props.baseUrl,
    hasMoreItems: true,
    nextHref: null,
  };

  loadItems = () => {
    const { nextHref, hasMoreItems, baseUrl } = this.state;
    let url;
    if (!nextHref || !hasMoreItems) {
      url = baseUrl;
    } else {
      url = nextHref;
    }
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

  render() {
    // console.log("RENDER", this.state)
    const { users } = this.state;
    const loader = <div className="loader">Loading ...</div>;

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.loadItems}
        hasMore={this.state.hasMoreItems}
        loader={loader}
      >
        <UsersList
          users={users}
          chat={this.props.chat}
        />
      </InfiniteScroll>
    );
  }
}

export default InfiniteUsersScroll;

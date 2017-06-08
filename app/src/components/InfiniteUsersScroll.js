import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import callApi from '../callApi.js';
import UsersList from './UsersList.js';

class InfiniteUsersScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      baseUrl: props.baseUrl,
      hasMoreItems: true,
      nextHref: null,
    };
    this.showChat = props.showChat;
  }

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
          showChat={this.showChat}
        />
      </InfiniteScroll>
    );
  }
}

export default InfiniteUsersScroll;

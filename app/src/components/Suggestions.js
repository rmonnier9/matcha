import React, { Component } from 'react';

import SortBar from './SortBar.js';
import callApi from '../callApi.js';
import UsersList from './UsersList.js';

class Suggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      users: [],
    };
  }

  componentDidMount() {
    const { search } = this.props.location;
    const url = `/suggestions${search}`;
    this.loadItems(url);
  }

  onSubmit = (event) => {
    event.preventDefault();
    const sort = event.target.sort.value;
    const search = `?sort=${sort}`;
    this.props.history.push(search);
    const url = `/suggestions${search}`;
    this.loadItems(url);
  }

  loadItems = (url) => {
    callApi(url, 'GET')
    .then((json) => {
      const { users, error } = json.data;
      if (error) {
        this.setState({
          error,
        });
      } else {
        this.setState({
          users,
        });
      }
    });
  }

  render() {
    // console.log('RENDER', this.state);
    const {
      message,
    } = this.state;
    const { users } = this.state;

    return (
      <div className="aroundme">
        <h2>Aroundme</h2>
        <form onSubmit={event => this.onSubmit(event)}>
          <div className="suggestions-params">
            <div className="errorMessageMain">{message}</div>
            <SortBar defaultSort={'popularity'} />
          </div>
          <input type="submit" value="Filter!" />
        </form>
        <UsersList
          users={users}
        />
      </div>
    );
  }
}

export default Suggestions;

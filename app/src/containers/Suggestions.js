import React, { Component } from 'react';

import SortBar from '../components/SortBar';
import callApi from '../callApi';
import UsersList from '../components/UsersList';

class Suggestions extends Component {
  state = {
    error: '',
    users: [],
  };

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
    .then(({ data: { users, error } }) => {
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

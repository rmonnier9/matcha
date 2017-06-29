import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

import SortBar from '../components/SortBar';
import callApi from '../callApi';
import UserList from '../components/UserList';

const style = {
  margin: 12,
};

class Suggestions extends Component {
  state = {
    error: '',
    users: [],
  };

  componentDidMount() {
    const url = '/suggestions';
    this.loadItems(url);
  }

  onSubmit = (event) => {
    event.preventDefault();
    const sort = event.target.sort.value;
    const url = `/suggestions?sort=${sort}`;
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
            <SortBar defaultSort={'distance'} />
          </div>
          <RaisedButton
            style={style}
            type="submit"
            label="FILTER"
            primary
          />
        </form>
        <UserList
          users={users}
        />
      </div>
    );
  }
}

export default Suggestions;

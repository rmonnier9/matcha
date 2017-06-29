import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';

class EmailConfirm extends Component {
  state = {
    error: '',
    message: '',
    confirmed: false,
  };

  componentDidMount = () => {
    const url = '/api/confirm';
    const query = queryString.parse(this.props.location.search);
    const { activation, login } = query;

    axios({ url, method: 'POST', data: { activation, login } })
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ message: 'email successfully confirmed !' });
        setTimeout(() => this.setState({ confirmed: true }), 3000);
      }
    });
  }


  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { error, message, confirmed } = this.state;

    return (
      confirmed ?
        <Redirect to={from} /> :
        <div><h1>{error || message || 'Loading...'}</h1></div>
    );
  }
}

export default EmailConfirm;

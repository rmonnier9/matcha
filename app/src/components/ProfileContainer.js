import React, { Component } from 'react';
import { connect } from 'react-redux';

import callApi from '../callApi.js';
import Profile from './Profile.js';


class ProfileContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      alreadyBlocked: false,
      alreadyLiked: false,
    };
  }

  componentDidMount() {
    const { url } = this.props.match;
    callApi(url, 'GET').then((json) => {
      const { profile } = json.data;
      this.setState({ profile });
    });
    const { login } = this.props.match.params;
    const alreadyBlockedURL = `/blocks/${login}`;
    callApi(alreadyBlockedURL, 'GET').then((json) => {
      const { alreadyBlocked } = json.data;
      if (alreadyBlocked) this.setState({ alreadyBlocked });
    });
    const alreadyLikedURL = `/likes/${login}`;
    callApi(alreadyLikedURL, 'GET').then((json) => {
      const { alreadyLiked } = json.data;
      if (alreadyLiked) this.setState({ alreadyLiked });
    });
  }

  onLikeClick = (e, likes) => {
    const { login } = this.props.match.params;
    const url = `/likes/${login}`;
    callApi(url, 'POST', { likes })
    .then((json) => {
      const { success } = json.data;
      if (success === true) {
        if (likes === true) {
          this.setState({ alreadyLiked: true });
        } else {
          this.setState({ alreadyLiked: false });
        }
      }
    });
  }

  onBlockClick = (e, blocks) => {
    const { login } = this.props.match.params;
    const url = `/blocks/${login}`;
    callApi(url, 'POST', { blocks })
    .then((json) => {
      const { success } = json.data;
      if (success === true) {
        if (blocks === true) {
          this.props.history.push('/');
        } else {
          this.setState({ alreadyBlocked: false });
        }
      }
    });
  }

  onReportClick = () => {
    const { login } = this.props.match.params;
    const url = `/reports/${login}`;
    callApi(url, 'POST')
    .then((json) => {
      const { success } = json.data;
      if (success === true) {
        this.props.history.push('/');
      }
    });
  }

  render() {
    const { profile, alreadyBlocked, alreadyLiked } = this.state;
    const { currentLogin } = this.props;
    const { login } = this.props.match.params;
    const myprofile = login === currentLogin;

    if (!profile) { return (<div><h1>Loading...</h1></div>); }
    // console.log('RENDER', profile);
    return (
      <div className="profile">
        <Profile
          profile={profile}
          onReportClick={this.onReportClick}
          onBlockClick={this.onBlockClick}
          alreadyBlocked={alreadyBlocked}
          onLikeClick={this.onLikeClick}
          alreadyLiked={alreadyLiked}
          myprofile={myprofile}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth } = state;
  const { currentLogin } = auth;

  return {
    currentLogin,
  };
};

export default connect(mapStateToProps)(ProfileContainer);

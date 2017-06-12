import React, { Component } from 'react';
import { connect } from 'react-redux';

import callApi from '../callApi.js';
import ProfileComponent from './ProfileComponent.js';
import LikeContainer from './LikeContainer.js';
import BlockContainer from './BlockContainer.js';

class ProfileContainer extends Component {
  state = {
    profile: null,
    error: '',
  };

  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    const { url } = this.props.match;
    callApi(url, 'GET').then((json) => {
      if (!this._mounted) return false;
      const { error, profile } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ profile });
      }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    // console.log('RENDER', this.state);
    const { profile, error } = this.state;
    const { currentLogin } = this.props;
    const { login } = this.props.match.params;
    const isMyProfile = login === currentLogin;

    if (error || !profile) {
      return (<div><h1>{error || 'Loading...'}</h1></div>);
    }
    return (
      <div className="profile">
        <h1>{profile.login}</h1>
        <ProfileComponent
          profile={profile}
          isMyProfile={isMyProfile}
        />
        <LikeContainer
          login={login}
          isMyProfile={isMyProfile}
        />
        <BlockContainer
          login={login}
          isMyProfile={isMyProfile}
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

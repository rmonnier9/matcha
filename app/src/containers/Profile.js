import React, { Component } from 'react';
import { connect } from 'react-redux';

import callApi from '../callApi';
import ProfileComponent from '../components/ProfileComponent';
import LikeButton from './LikeButton';
import BlockButton from './BlockButton';

class Profile extends Component {
  state = {
    profile: null,
    error: '',
  };

  componentDidMount() {
    const { url } = this.props.match;
    callApi(url, 'GET').then(({ data: { error, profile } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ profile });
      }
    });
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
      <ProfileComponent
        profile={profile}
        isMyProfile={isMyProfile}
      />
    );
  }
}

const mapStateToProps = ({ auth: { currentLogin } }) => ({
  currentLogin,
});

export default connect(mapStateToProps)(Profile);

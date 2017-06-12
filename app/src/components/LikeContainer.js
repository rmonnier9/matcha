import React, { Component } from 'react';

import callApi from '../callApi.js';

class LikeContainer extends Component {
  state = {
    alreadyLiked: false,
    error: '',
  };

  componentDidMount() {
    const { login } = this.props;
    const url = `/likes/${login}`;
    callApi(url, 'GET').then(({ data: { error, alreadyLiked } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyLiked });
      }
    });
  }

  onLikeClick = (e, likes) => {
    const { login } = this.props;
    const url = `/likes/${login}`;
    callApi(url, 'POST', { likes })
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyLiked: likes });
      }
    });
  }

  render() {
    // console.log('RENDER', this.state);
    const { alreadyLiked, error } = this.state;
    const { isMyProfile } = this.props;

    return (
      <div className="like">
        {!isMyProfile &&
          <div className="likeAction">
            {!alreadyLiked &&
              <span role="button" tabIndex={0} className="like" onClick={e => this.onLikeClick(e, true)}>Like this.</span>
            }
            {alreadyLiked &&
              <span role="button" tabIndex={0} className="like" onClick={e => this.onLikeClick(e, false)}>Unlike this.</span>
            }
          </div>
        }
        <div>{error}</div>
      </div>
    );
  }
}

export default LikeContainer;

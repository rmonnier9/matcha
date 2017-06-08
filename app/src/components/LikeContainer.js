import React, { Component } from 'react';

import callApi from '../callApi.js';

class LikeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyLiked: false,
      error: '',
    };
  }

  componentDidMount() {
    const { login } = this.props;
    const url = `/likes/${login}`;
    callApi(url, 'GET').then((json) => {
      const { error, alreadyLiked } = json.data;
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
    .then((json) => {
      const { error } = json.data;
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

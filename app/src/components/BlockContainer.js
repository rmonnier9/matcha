import React, { Component } from 'react';

import callApi from '../callApi.js';

class BlockContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alreadyBlocked: false,
      error: '',
    };
  }

  componentDidMount() {
    const { login } = this.props;
    const url = `/blocks/${login}`;
    callApi(url, 'GET').then((json) => {
      const { error, alreadyBlocked } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyBlocked });
      }
    });
  }

  onBlockClick = (e, blocks) => {
    const { login } = this.props;
    const url = `/blocks/${login}`;
    callApi(url, 'POST', { blocks })
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyBlocked: blocks });
      }
    });
  }

  onReportClick = () => {
    const { login } = this.props;
    const url = `/reports/${login}`;
    callApi(url, 'POST')
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyBlocked: true });
      }
    });
  }

  render() {
    // console.log('RENDER', this.state);
    const { alreadyBlocked, error } = this.state;
    const { isMyProfile } = this.props;

    return (
      <div className="block">
        {!isMyProfile &&
          <div className="blockreport">
            {!alreadyBlocked &&
              <span role="button" tabIndex={0} className="block" onClick={e => this.onBlockClick(e, true)}>Block this.</span>
            }
            {alreadyBlocked &&
              <span role="button" tabIndex={0} className="block" onClick={e => this.onBlockClick(e, false)}>Unblock this.</span>
            }
            <span role="button" tabIndex={0} className="fake" onClick={e => this.onReportClick(e)}>Fake account ?</span>
          </div>
        }
        <div>{error}</div>
      </div>
    );
  }
}

export default BlockContainer;

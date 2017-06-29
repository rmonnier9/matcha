import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ActionBlock from 'material-ui/svg-icons/action/visibility-off';
import ActionUnblock from 'material-ui/svg-icons/action/visibility';

import callApi from '../callApi';

const style = {
  active: {
    color: 'rgba(0, 0, 0, 0.90)',
  },
  inactive: {
    color: 'rgba(0, 0, 50, 0.26)',
  },
};

class BlockButton extends Component {
  state = {
    alreadyBlocked: false,
    error: '',
  };

  componentDidMount() {
    const { login } = this.props;
    const url = `/blocks/${login}`;
    callApi(url, 'GET').then(({ data: { error, alreadyBlocked } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyBlocked });
      }
    });
  }

  onBlockClick = blocks => () => {
    const { login } = this.props;
    const url = `/blocks/${login}`;
    callApi(url, 'POST', { blocks })
    .then(({ data: { error } }) => {
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
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ alreadyBlocked: true });
      }
    });
  }

  render() {
    // console.log('RENDER', this.state);
    const { alreadyBlocked } = this.state;
    const { isMyProfile } = this.props;

    return (
      isMyProfile ?
      null :
      <div>
        <IconButton tooltip="SVG Icon">
          {alreadyBlocked ?
            <ActionBlock color={style.active.color} onTouchTap={this.onBlockClick(false)} /> :
            <ActionUnblock color={style.inactive.color} onTouchTap={this.onBlockClick(true)} />
          }
        </IconButton>
        <span role="button" tabIndex={0} className="fake" onClick={e => this.onReportClick(e)}>Fake account ?</span>
      </div>
    );
  }
}

BlockButton.propTypes = {
  login: PropTypes.string.isRequired,
  isMyProfile: PropTypes.bool,
};


BlockButton.defaultProps = {
  isMyProfile: false,
};

export default BlockButton;

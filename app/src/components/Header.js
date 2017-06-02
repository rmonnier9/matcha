import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions';

import Nav from './Nav.js';

class Header extends Component {

  handleClick = () => {
    this.props.dispatch(logoutUser());
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <header className="header">
        {isAuthenticated &&
          <Nav
            handleClick={this.handleClick}
          />
        }
      </header>
    );
  }

}


//= ====================================
//  CONNECT
//-------------------------------------

const mapStateToProps = (state) => {
  const { auth } = state;
  const { isAuthenticated, errorMessage } = auth;

  return {
    isAuthenticated,
    errorMessage,
  };
};

export default connect(mapStateToProps)(Header);

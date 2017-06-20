import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

const style = {
  title: {
    cursor: 'pointer',
  },
};

const SignOutMenu = props => (
  <IconMenu
    iconButtonElement={
      <IconButton><MoreVertIcon /></IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem
      containerElement={<Link to="/notifications" />}
      primaryText="Notifications"
    />
    <MenuItem
      primaryText="Sign out"
      onTouchTap={props.handleSignOut}
    />
  </IconMenu>
);

export default class NavBar extends React.Component {
  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState({ open: !this.state.open });
  }

  // handleTitleTouchTap = () => {
  //   browserHistory.push('/'); // Navigate home
  // }

  render() {
    return (
      <div>
        <AppBar
          onLeftIconButtonTouchTap={this.handleToggle}
          title={<span style={style.title}>Matcha</span>}
          onTitleTouchTap={this.handleTitleTouchTap}
          iconElementRight={<SignOutMenu handleSignOut={this.props.handleSignOut} />}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <List>
            <ListItem
              containerElement={<Link to="/" />}
              onTouchTap={this.handleToggle}
              primaryText="Around me"
            />
            <ListItem
              containerElement={<Link to="/search" />}
              onTouchTap={this.handleToggle}
              primaryText="Search"
            />
            <ListItem
              containerElement={<Link to="/myprofile/matches" />}
              onTouchTap={this.handleToggle}
              primaryText="Chat"
            />
            <ListItem
              containerElement={<Link to="/myprofile" />}
              onTouchTap={this.handleToggle}
              primaryText="My profile"
            />
          </List>
        </Drawer>
      </div>
    );
  }
}

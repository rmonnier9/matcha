import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ notificationsNumber, handleClick }) => (
  <nav className="nav">
    <Link to="/">Around me</Link>
    <Link to="/myprofile/matches">My matches</Link>
    <Link to="/notifications">Notifications{`(${notificationsNumber})`}</Link>
    <Link to="/search">Search</Link>
    <Link to="/myprofile">My Profile</Link>
    <button onClick={handleClick} className="btn btn-primary">
      Logout
    </button>
  </nav>
);

export default Nav;

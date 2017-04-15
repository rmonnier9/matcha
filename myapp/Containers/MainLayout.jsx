// import React from 'react';
import { Link } from 'react-router';

const MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">
        <header className="primary-header"></header>
        <aside className="primary-aside">
          <ul>
            <li><Link to="/" activeClassName="active">Home</Link></li>
            <li><Link to="/search" activeClassName="active">Search</Link></li>
            <li><Link to="/profile" activeClassName="active">My profile</Link></li>
          </ul>
        </aside>
        <main>
          {this.props.children}
        </main>
      </div>
    );
  }
});

export default MainLayout;

import React from 'react';
import { Link } from 'react-router-dom';

import EncartLeft from './EncartLeft.js';

const UsersList = (props) => {
  if (props.users.length === 0) {
    return (<div>Nothing to show</div>);
  }
  return (
    <div className="users-list">
      {
        props.users.map((user) => {
          const { login } = user;
          const url = `/profile/${login}`;
          return (
            <div key={login} className="user">
              <Link to={url}>{login}</Link>
              <EncartLeft
                profile={user}
              />
            </div>
          );
        })
      }
    </div>
  );
};

export default UsersList;

import React from 'react';
import { Link } from 'react-router-dom';

import EncartLeft from './EncartLeft';

const UsersList = ({ users, showChat }) => {
  if (users.length === 0) {
    return (<div>Nothing to show</div>);
  }
  return (
    <div className="users-list">
      {
        users.map((user) => {
          const { login } = user;
          const urlProfile = `/profile/${login}`;
          const urlChat = `/chat/${login}`;
          return (
            <div key={login} className="user">
              <Link to={urlProfile}>{login}</Link>
              {showChat &&
                <Link to={urlChat}>Open Chat</Link>
              }
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

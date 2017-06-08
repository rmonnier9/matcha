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
          const urlProfile = `/profile/${login}`;
          const urlChat = `/chat/${login}`;
          return (
            <div key={login} className="user">
              <Link to={urlProfile}>{login}</Link>
              {props.showChat &&
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

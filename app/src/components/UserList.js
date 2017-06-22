import React from 'react';

import UserListItem from './UserListItem';

const UserList = ({ users, chat }) => (
  users.length === 0 ?
    <div className="users-list" /> :
    <div className="users-list">
      {
        users.map(user => (
          <div key={user.login} className="user">
            <UserListItem
              profile={user}
              chat={chat}
            />
          </div>
        ))
      }
    </div>
);

export default UserList;

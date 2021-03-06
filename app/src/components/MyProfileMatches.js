import React from 'react';

import InfiniteUsersScroll from '../containers/InfiniteUsersScroll';

const MyProfileMatches = () => (
  <div className="mymatches">
    <h2>Chat</h2>
    <InfiniteUsersScroll
      baseUrl={'/myprofile/matches'}
      chat
    />
  </div>
);


export default MyProfileMatches;

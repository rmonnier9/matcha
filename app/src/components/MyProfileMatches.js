import React from 'react';

import InfiniteUsersScroll from './InfiniteUsersScroll.js';

const MyProfileMatches = () => (
  <div className="mymatches">
    <h2>My matches</h2>
    <InfiniteUsersScroll
      baseUrl={'/myprofile/matches'}
      showChat
    />
  </div>
);


export default MyProfileMatches;

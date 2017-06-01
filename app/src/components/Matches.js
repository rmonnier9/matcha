import React from 'react';

import InfiniteUsersScroll from './InfiniteUsersScroll.js';

const Matches = () => (
  <div className="mymatches">
    <h2>My matches</h2>
    <InfiniteUsersScroll
      baseUrl={'/matches'}
    />
  </div>
);


export default Matches;

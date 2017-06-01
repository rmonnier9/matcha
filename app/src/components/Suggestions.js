import React from 'react';

import InfiniteUsersScroll from './InfiniteUsersScroll.js';

const Suggestions = () => (
  <div className="aroundme">
    <h2>Aroundme</h2>
    <InfiniteUsersScroll
      baseUrl={'/suggestions'}
    />
  </div>
);

export default Suggestions;

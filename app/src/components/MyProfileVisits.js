import React from 'react';
import { Link } from 'react-router-dom';

import InfiniteUsersScroll from '../containers/InfiniteUsersScroll';

const MyProfileVisits = () => (
  <div className="myvisits">
    <h2>They visited my profile</h2>
    <nav>
      <Link to="/myprofile">Back to my profile</Link>
    </nav>
    <InfiniteUsersScroll
      baseUrl={'/myprofile/visits'}
    />
  </div>
);


export default MyProfileVisits;

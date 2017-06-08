import React from 'react';
import { Link } from 'react-router-dom';

import InfiniteUsersScroll from './InfiniteUsersScroll.js';

const MyProfileLikes = () => (
  <div className="mylikes">
    <h2>They liked my profile :</h2>
    <nav>
      <Link to="/myprofile">Back to my profile</Link>
    </nav>
    <InfiniteUsersScroll
      baseUrl={'/myprofile/likes'}
    />
  </div>
);


export default MyProfileLikes;

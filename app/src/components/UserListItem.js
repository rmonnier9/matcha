import React from 'react';
import { Link } from 'react-router-dom';

import ProfilePicture from './ProfilePicture';
import Tags from './Tags';

const styleLink = {
  textDecoration: 'none',
  display: 'flex',
};

const UserListItem = ({ profile, chat }) => {
  const {
    login,
    profilePicture,
    pictures,
    firstname,
    distance,
    tagsInCommon,
    tags,
    popularity,
    age,
  } = profile;

  const roundTwo = (nb) => {
    const nbM = nb * 100;
    const nbR = Math.floor(nbM);
    return (nbR / 100);
  };

  return (
    <Link style={styleLink} to={chat ? `/chat/${login}` : `/profile/${login}`}>
      <ProfilePicture
        login={login}
        profilePicture={profilePicture}
        pictures={pictures}
      />
      <div>
        <p>
          <span>{firstname}</span>, <span>{age}</span>
        </p>
        <Tags tags={tags || []} />
        <p>
          <span className="distance">
            at <span>{roundTwo(distance / 1000)}</span> km
          </span><br />
          <span className="tagsInCommon">
            <span>{tagsInCommon.length}</span> tags in common
          </span><br />
          <span className="popularity">
            <span>{roundTwo(popularity)}</span>pts.
          </span>
        </p>
      </div>
    </Link>
  );
};

export default UserListItem;

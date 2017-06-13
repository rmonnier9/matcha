import React from 'react';

import ProfilePicture from './ProfilePicture';
import Tags from './Tags';

const EncartLeft = ({ profile }) => {
  const {
    login,
    profilePicture,
    pictures,
    firstname,
    lastname,
    distance,
    tagsInCommon,
    tags,
    popularity,
    lastConnection,
    age,
  } = profile;

  const roundTwo = (nb) => {
    const nbM = nb * 100;
    const nbR = Math.floor(nbM);
    return (nbR / 100);
  };

  return (
    <div className="encart-left">
      <ProfilePicture
        login={login}
        profilePicture={profilePicture}
        pictures={pictures}
      />
      <div className="profile-name">
        <span>{firstname} </span>
        <span>{lastname}</span>
      </div>
      <div className="profile-name">
        <span>at {roundTwo(distance / 1000)} km</span>
      </div>
      <div className="profile-name">
        <span>{tagsInCommon} tags in common</span>
      </div>
      <div className="popularity">
        <span>Age {age}</span>
      </div>
      <Tags tags={tags || []} />
      <div className="popularity">
        <span>{roundTwo(popularity)}</span>pts.
      </div>
      <div className="lastConnection">
        <span>{lastConnection}</span>
      </div>
    </div>
  );
};

export default EncartLeft;

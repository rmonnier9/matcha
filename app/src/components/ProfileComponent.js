import React from 'react';

import LikeButton from '../containers/LikeButton';
import BlockButton from '../containers/BlockButton';
import Tags from './Tags';
import ImageDisplayer from './ImageDisplayer';

const style = {
  display: 'flex',
};

const ProfileComponent = ({ profile, isMyProfile }) => {
  const roundTwo = (nb) => {
    const nbM = nb * 100;
    const nbR = Math.floor(nbM);
    return (nbR / 100);
  };

  return (
    <div className="profile">
      <div style={style}>
        <h1><span>{profile.firstname}</span>, <span>{profile.age}</span></h1>
        <div style={style}>
          <LikeButton
            login={profile.login}
            isMyProfile={profile.isMyProfile}
          />
          <BlockButton
            login={profile.login}
            isMyProfile={profile.isMyProfile}
          />
        </div>
      </div>
      <div>
        <ImageDisplayer
          login={profile.login}
          pictures={profile.pictures}
          profilePicture={profile.profilePicture}
          editable={isMyProfile}
        />
        <div>
          <h2>Last connection</h2>
          <p>
            <span>{profile.lastConnection}</span>
          </p>
        </div>
        <div>
          <h2>Location</h2>
          <p>
            at <span>{roundTwo(profile.distance / 1000)}</span> km
          </p>
        </div>
        <div>
          <h2>Center of interest</h2>
          <Tags tags={profile.tags || []} />
        </div>
        <div>
          <h2>Popularity score</h2>
          <p>
            <span>{roundTwo(profile.popularity)}</span>pts.
          </p>
        </div>
      </div>

    </div>
  );
}

export default ProfileComponent;

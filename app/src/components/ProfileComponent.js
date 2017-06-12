import React from 'react';

import EncartLeft from './EncartLeft.js';
import EncartRight from './EncartRight.js';
import ImageDisplayer from './ImageDisplayer.js';

const ProfileComponent = ({ profile, isMyProfile }) => (
  <div className="profilecomponent">
    <EncartLeft
      profile={profile}
    />
    <EncartRight
      profile={profile}
    />
    <ImageDisplayer
      pictures={profile.pictures}
      login={profile.login}
      editable={isMyProfile}
    />
  </div>
);

export default ProfileComponent;

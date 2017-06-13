import React from 'react';

import EncartLeft from './EncartLeft';
import EncartRight from './EncartRight';
import ImageDisplayer from './ImageDisplayer';

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

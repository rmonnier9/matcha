import React from 'react';

const ProfilePicture = ({ login, pictures, profilePicture }) => {
  let img;
  if (pictures.length === 0 || profilePicture === -1) {
    img = 'default';
  } else {
    img = pictures[profilePicture];
  }
  const token = localStorage.getItem('x-access-token');
  const url = `/api/pictures/${login}/${img}?token=${token}`;
  return (
    <div className="profile-picture">
      <img alt="profile" src={url} />
    </div>
  );
};

export default ProfilePicture;

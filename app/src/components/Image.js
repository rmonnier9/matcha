import React from 'react';

const Image = (props) => {
  const { pictures, login, deletePicture, setProfilePicture } = props;
  const token = localStorage.getItem('x-access-token');
  let url;
  const imgList = pictures.map((picture) => {
    url = `/api/pictures/${login}/${picture}?token=${token}`;
    return (
      <div
        key={picture}
      >
        <img
          src={url}
          alt={''}
        />
        <span
          role="button"
          tabIndex={0}
          onClick={() => setProfilePicture(picture)}
        >O
        </span>
        <span
          role="button"
          tabIndex={0}
          onClick={deletePicture}
        >X
        </span>
      </div>
    );
  });
  return (
    <div className="imageProf">
      {imgList}
    </div>
  );
};

export default Image;

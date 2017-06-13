import React from 'react';
import ProfilePicture from './ProfilePicture';

const Image = ({ picture, login, deletePicture, setProfilePicture, editable }) => {
  const token = localStorage.getItem('x-access-token');
  const url = `/api/pictures/${login}/${picture}?token=${token}`;
  return (
    <div
      key={picture}
    >
      <img
        src={url}
        alt={''}
      />
      {editable &&
        <div>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setProfilePicture(picture)}
          >O
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => deletePicture(picture)}
          >X
          </span>
        </div>
      }
    </div>
  );
};

const ImageDisplayer = (props) => {
  const {
    pictures,
    profilePicture,
    login,
    deletePicture,
    setProfilePicture,
    editable,
  } = props;

  const imgList = pictures.map(picture => (
    <div key={picture}>
      <Image
        login={login}
        picture={picture}
        deletePicture={deletePicture}
        setProfilePicture={setProfilePicture}
        editable={editable}
      />
    </div>
  ));
  return (
    <div>
      <div className="imageProf">
        <span>Profile picture</span>
        <ProfilePicture
          login={login}
          profilePicture={profilePicture}
          pictures={pictures}
        />
      </div>
      <div className="allimages">
        <span>All pictures</span>
        {imgList}
      </div>
    </div>
  );
};

export default ImageDisplayer;

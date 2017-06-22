import React from 'react';
import ProfilePicture from './ProfilePicture';

const style = {
  display: 'flex',
}

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

const ImageDisplayer = ({
  pictures,
  profilePicture,
  login,
  deletePicture,
  setProfilePicture,
  editable,
}) => {
  const imgList = pictures.map((picture, index) => (
    index === profilePicture ?
    null :
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
    <div className="image-displayer" style={style}>
      <Image
        className="profilePicture"
        login={login}
        picture={pictures[profilePicture]}
        deletePicture={deletePicture}
        setProfilePicture={setProfilePicture}
        editable={editable}
      />
      {imgList}
    </div>
  );
};

export default ImageDisplayer;

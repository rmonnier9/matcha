import React from 'react';
import TagsInput from 'react-tagsinput';

import 'react-tagsinput/react-tagsinput.css';

const UpdateInfosComponent = (props) => {
  const {
    handleSubmit,
    firstname,
    updateFirstname,
    lastname,
    updateLastname,
    oldEmail,
    email,
    updateEmail,
    birthDate = '',
    updateBirthDate,
    gender,
    updateGender,
    lookingFor,
    updateLookingFor,
    about,
    updateAbout,
    tags,
    updateTags,
  } = props;

  return (
    <div className="updateinfoscomponent">
      <br />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">My name is </label>
          <input
            type="text"
            placeholder="firstname"
            className="name"
            onChange={updateFirstname}
            value={firstname}
          />
          <input
            type="text"
            placeholder="lastname"
            className="name"
            onChange={updateLastname}
            value={lastname}
          />
        </div>
        <br />
        <div>
          <label htmlFor="email">Email : {oldEmail}</label>
          <input
            type="email"
            placeholder="new email"
            className="email"
            onChange={updateEmail}
            value={email}
          />
        </div>
        <br />
        <div>
          <label htmlFor="bday">My birthday is...</label>
          <input
            type="date"
            placeholder="birthDate"
            className="bday"
            onChange={updateBirthDate}
            value={birthDate || new Date().toISOString().substr(0, 10)}
          />
        </div>
        <br />
        <div>
          <label htmlFor="gender">{"I'm a..."}</label>
          <input
            type="radio"
            value="male"
            className="gender"
            onChange={updateGender}
            checked={gender === 'male'}
          />Dude
          <input
            type="radio"
            value="female"
            className="gender"
            onChange={updateGender}
            checked={gender === 'female'}
          />Girl
        </div>
        <br />
        <div>
          <label htmlFor="lookingFor">I want to have fun with a...</label>
          <input
            type="radio"
            value="male"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'male'}
          />Dude
          <input
            type="radio"
            value="female"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'female'}
          />Girl
          <input
            type="radio"
            value="both"
            className="lookingFor"
            onChange={updateLookingFor}
            checked={lookingFor === 'both'}
          />Whatever
        </div>
        <br />
        <div>
          <label htmlFor="name">About me : </label>
          <input
            type="text"
            style={{ height: '200px', width: '420px' }}
            placeholder="About me..."
            className="about"
            onChange={updateAbout}
            value={about}
          />
        </div>
        <TagsInput value={tags} onChange={updateTags} />
        <input type="submit" value="Save my changes" />
      </form>
    </div>
  );
};


export default UpdateInfosComponent;

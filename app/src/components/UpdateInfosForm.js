import React from 'react';
import TagsInput from 'react-tagsinput';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import 'react-tagsinput/react-tagsinput.css';

const style = {
  margin: 12,
};

const UpdateInfosForm = (props) => {
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
          <TextField
            style={style}
            name="firstname"
            hintText="firstname"
            floatingLabelText="firstname"
            onChange={updateFirstname}
            value={firstname}
            required
          />
          <TextField
            style={style}
            name="lastname"
            hintText="lastname"
            floatingLabelText="lastname"
            onChange={updateLastname}
            value={lastname}
            required
          /><br />
        </div>
        <br />
        <div>
          <label htmlFor="email">Email : {oldEmail}</label>
          <TextField
            style={style}
            type="email"
            name="email"
            hintText="email"
            floatingLabelText="email"
            onChange={updateEmail}
            value={email}
          /><br />
        </div>
        <br />
        <div>
          <label htmlFor="bday">My birthday is...</label>
          <input
            type="date"
            placeholder="birthDate"
            className="bday"
            onChange={updateBirthDate}
            value={birthDate}
          />
        </div>
        <br />
        <div>
          <SelectField
            floatingLabelText="I'm a"
            value={gender}
            onChange={updateGender}
          >
            <MenuItem value={'male'} primaryText="dude" />
            <MenuItem value={'female'} primaryText="girl" />
          </SelectField><br />
        </div>
        <br />
        <div>
          <SelectField
            floatingLabelText="I'm looking for"
            value={lookingFor}
            onChange={updateLookingFor}
          >
            <MenuItem value={'male'} primaryText="dudes" />
            <MenuItem value={'female'} primaryText="girls" />
            <MenuItem value={'both'} primaryText="both" />
          </SelectField><br />
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
        <RaisedButton
          style={style}
          type="submit"
          label="SAVE MY CHANGES"
          primary
        />
      </form>
    </div>
  );
};


export default UpdateInfosForm;

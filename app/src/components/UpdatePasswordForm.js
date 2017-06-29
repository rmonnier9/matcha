import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

const UpdatePasswordForm = ({
  updateOldPassword,
  oldPassword,
  updateNewPassword,
  newPassword,
  updateConfirmNewPassword,
  confirmNewPassword,
  handleSubmit,
}) => (
  <div className="updatepasswordcomponent">
    <form onSubmit={handleSubmit}>
      <h2>Change my password :</h2>
      <TextField
        style={style}
        type="password"
        hintText="old password"
        floatingLabelText="enter your old password"
        onChange={updateOldPassword}
        value={oldPassword}
        required
      />
      <TextField
        style={style}
        type="password"
        name="password"
        hintText="enter your password"
        floatingLabelText="enter your password"
        onChange={updateNewPassword}
        value={newPassword}
        required
      />
      <TextField
        style={style}
        type="password"
        name="confirmpassword"
        hintText="confirm your password"
        floatingLabelText="confirm your password"
        onChange={updateConfirmNewPassword}
        value={confirmNewPassword}
        required
      />
      <RaisedButton
        style={style}
        type="submit"
        label="UPDATE MY PASSWORD"
        primary
      />
    </form>
  </div>
);

export default UpdatePasswordForm;

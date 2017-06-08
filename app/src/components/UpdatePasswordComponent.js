import React from 'react';

const UpdatePasswordComponent = (props) => {
  const {
    updateOldPassword,
    oldPassword,
    updateNewPassword,
    newPassword,
    updateConfirmNewPassword,
    confirmNewPassword,
    handleSubmit,
  } = props;

  return (
    <div className="updatepasswordcomponent">
      <form onSubmit={handleSubmit}>
        <h2>Change my password :</h2>
        <div>
          <input
            type="password"
            placeholder="old password"
            className="password"
            onChange={updateOldPassword}
            value={oldPassword}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="new password"
            className="password"
            onChange={updateNewPassword}
            value={newPassword}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="confirm new password"
            className="password"
            onChange={updateConfirmNewPassword}
            value={confirmNewPassword}
          />
        </div>
        <input type="submit" value="Update my password" />
      </form>
    </div>
  );
};

export default UpdatePasswordComponent;

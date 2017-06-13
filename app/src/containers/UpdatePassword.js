import React, { Component } from 'react';
import callApi from '../callApi.js';
import UpdatePasswordForm from '../components/UpdatePasswordForm';

class UpdatePassword extends Component {
  state = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    error: '',
    message: '',
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = this.state;
    const data = {
      oldPassword,
      newPassword,
      confirmNewPassword,
    };
    const url = '/update_password';
    callApi(url, 'POST', data)
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          message: 'Password successfully updated !',
        });
      }
    });
  }

  render() {
    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
      error,
      message,
    } = this.state;
    return (
      <div className="updatepassword">
        <UpdatePasswordForm
          updateOldPassword={this.updateOldPassword}
          oldPassword={oldPassword}
          updateNewPassword={this.updateNewPassword}
          newPassword={newPassword}
          updateConfirmNewPassword={this.updateConfirmNewPassword}
          confirmNewPassword={confirmNewPassword}
          handleSubmit={this.handleSubmit}
        />
        <p>{message || error || ''}</p>
      </div>
    );
  }
}

export default UpdatePassword;

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

  updateOldPassword = e => this.setState({ oldPassword: e.target.value })
  updateNewPassword = e => this.setState({ newPassword: e.target.value })
  updateConfirmNewPassword = e => this.setState({ confirmNewPassword: e.target.value })

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
        this.setState({ error, message: '' });
      } else {
        this.setState({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
          message: 'Password successfully updated !',
          error: '',
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

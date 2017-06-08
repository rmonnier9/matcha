import React, { Component } from 'react';

import callApi from '../callApi.js';
import UpdateInfosComponent from './UpdateInfosComponent.js';

class UpdateInfos extends Component {
  constructor(props) {
    super(props);
    const {
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
      email,
      login,
    } = props.profile;
    this.state = {
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
      email: '',
      error: '',
      message: '',
    };
    this.oldEmail = email;
    this.login = login;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstname,
      lastname,
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
    } = this.state;
    const data = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
    };
    const url = '/myprofile';
    callApi(url, 'POST', data)
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({
          message: 'Profile successfully updated !',
          email: '',
        });
      }
    });
  }

  updateFirstname = e => this.setState({ firstname: e.target.value })
  updateLastname = e => this.setState({ lastname: e.target.value })
  updateEmail = e => this.setState({ email: e.target.value })
  updateBirthDate = e => this.setState({ birthDate: e.target.value })
  updateGender = e => this.setState({ gender: e.target.value })
  updateLookingFor = e => this.setState({ lookingFor: e.target.value })
  updateAbout = e => this.setState({ about: e.target.value })
  updateTags = tags => this.setState({ tags })

  render() {
    // console.log("render", this.state)
    const {
      firstname,
      lastname,
      email,
      birthDate,
      gender,
      lookingFor,
      about,
      tags,
      message,
      error,
    } = this.state;
    const {
      login,
      oldEmail,
    } = this;

    return (
      <div className="updateinfos">
        <UpdateInfosComponent
          firstname={firstname}
          updateFirstname={this.updateFirstname}
          lastname={lastname}
          updateLastname={this.updateLastname}
          email={email}
          oldEmail={oldEmail}
          updateEmail={this.updateEmail}
          birthDate={birthDate}
          updateBirthDate={this.updateBirthDate}
          gender={gender}
          updateGender={this.updateGender}
          lookingFor={lookingFor}
          updateLookingFor={this.updateLookingFor}
          about={about}
          updateAbout={this.updateAbout}
          tags={tags}
          updateTags={this.updateTags}
          login={login}
          handleSubmit={this.handleSubmit}
        />
        <p>{message || error || ''}</p>
      </div>
    );
  }

}


export default UpdateInfos;

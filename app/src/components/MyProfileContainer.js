import React, { Component } from 'react';

import callApi from '../callApi.js';
import MyProfileForm from './MyProfileForm.js';
import ImageManager from './ImageManager.js';

class MyProfileContainer extends Component {
  state = {
    profileLoaded: false,
    message: '',
    pictures: [],
    tags: [],
    fistname: '',
    lastname: '',
    email: '',
  }

  componentDidMount() {
    const url = '/myprofile';
    callApi(url, 'GET')
    .then((json) => {
      const { success, profile, message } = json.data;
      if (!success) {
        this.setState({ message });
      } else {
        const {
          pictures,
          tags,
          firstname,
          lastname,
          email,
          birthDate,
          gender,
          lookingFor,
          location,
          login,
        } = profile;
        this.login = login;
        this.oldEmail = email;
        this.setState({
          profileLoaded: true,
          pictures,
          location,
          firstname,
          lastname,
          birthDate,
          gender,
          lookingFor,
          tags,
        });
      }
    });
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
      tags,
    } = this.state;
    const data = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email,
      birthDate,
      gender,
      lookingFor,
      tags,
    };
    const url = '/myprofile';
    callApi(url, 'POST', data)
    .then((json) => {
      const { success, message } = json.data;
      if (!success) {
        this.setState({ message });
      } else {
        this.setState({ message: 'Profile successfully updated !', email: '' })
      }
    });
  }

  updateFirstname = e => this.setState({ firstname: e.target.value })
  updateLastname = e => this.setState({ lastname: e.target.value })
  updateEmail = e => this.setState({ email: e.target.value })
  updateBirthDate = e => this.setState({ birthDate: e.target.value })
  updateGender = e => this.setState({ gender: e.target.value })
  updateLookingFor = e => this.setState({ lookingFor: e.target.value })
  updateTags = tags => this.setState({ tags })

  render() {
    // console.log("render", this.state)
    const {
      profileLoaded,
      pictures,
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
      location,
      tags,
      message,
      email,
    } = this.state;
    const { login, oldEmail } = this;

    if (!profileLoaded) {
      return (<div><h1>{message || 'Loading...'}</h1></div>);
    }
    return (
      <div className="profile">
        <h1>{login}</h1>
        <ImageManager
          pictures={pictures}
          login={login}
        />
        <MyProfileForm
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
          tags={tags}
          updateTags={this.updateTags}
          login={login}
          location={location}
          message={message}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }

}


export default MyProfileContainer;

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
          birthDate,
          gender,
          lookingFor,
          location,
          login,
        } = profile;
        this.login = login;
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
      birthDate,
      gender,
      lookingFor,
      tags,
    } = this.state;
    const data = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
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
      }
    });
  }

  updateFirstname = e => this.setState({ firstname: e.target.value })
  updateLastname = e => this.setState({ lastname: e.target.value })
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
    } = this.state;
    const { login } = this;

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
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }

}


export default MyProfileContainer;

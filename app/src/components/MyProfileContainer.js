import React, { Component } from 'react';

import callApi from '../callApi.js';
import MyProfileForm from './MyProfileForm.js';
import ImageManager from './ImageManager.js';

class MyProfileContainer extends Component {
  state = {
    profile: null,
    pictures: [],
    tags: [],
    message: '',
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
          firstname,
          lastname,
          birthDate,
          gender,
          lookingFor,
          tags,
          location,
        } = profile;
        this.setState({
          pictures,
          firstname,
          lastname,
          birthDate,
          gender,
          lookingFor,
          tags,
          profile,
          location,
        });
      }
    });
  }

  onImageDrop = (files) => {
    this.handleImageUpload(files[0]);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
    } = this.state;
    const data = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      birthDate,
      gender,
      lookingFor,
      tags: this.state.tags,
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
      pictures,
      firstname,
      lastname,
      birthDate,
      gender,
      lookingFor,
      location,
      tags, message, profile,
    } = this.state;

    if (!profile) {
      return (<div><h1>{message || 'Loading...'}</h1></div>);
    }
    return (
      <div className="profile">
        <h1>{profile.login}</h1>
        <ImageManager
          pictures={pictures}
          login={profile.login}
        />
        <MyProfileForm
          handleSubmit={this.handleSubmit}
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
          login={profile.login}
          location={location}
        />
      </div>
    );
  }

}


export default MyProfileContainer;

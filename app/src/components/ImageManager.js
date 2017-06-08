import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import callApi from '../callApi.js';
import ImageDisplayer from './ImageDisplayer.js';

class ImageManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: props.profile.profilePicture,
      pictures: props.profile.pictures,
      error: '',
    };
    this.login = props.profile.login;
  }

  onImageDrop = (files) => {
    this.imageUpload(files[0]);
  }

  setProfilePicture = (id) => {
    const url = `/myprofile/pictures/${id}`;
    callApi(url, 'GET')
    .then((json) => {
      const { error, profilePicture } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ profilePicture });
      }
    });
  }

  imageUpload = (file) => {
    const url = '/myprofile/pictures';

    const formData = new FormData();
    formData.append('imageUploaded', file);

    callApi(url, 'POST', formData, { 'Content-Type': 'multipart/form-data' })
    .then((json) => {
      const { pictures, error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        this.setState({ pictures });
      }
    });
  }

  deletePicture = (id) => {
    const url = `/myprofile/pictures/${id}`;
    callApi(url, 'DELETE')
    .then((json) => {
      const { error } = json.data;
      if (error) {
        this.setState({ error });
      } else {
        const pictures = this.state.pictures.filter(picture => picture !== id);
        this.setState({ pictures });
      }
    });
  }

  render() {
    const { login } = this;
    const { pictures, profilePicture, error } = this.state;
    return (
      <div className="image-manager">
        <ImageDisplayer
          login={login}
          pictures={pictures}
          profilePicture={profilePicture}
          setProfilePicture={this.setProfilePicture}
          deletePicture={this.deletePicture}
          editable
        />
        <Dropzone
          multiple={false}
          accept="image/*"
          onDrop={this.onImageDrop}
        >
          <p>Drop an image or click to select a file to upload.</p>
        </Dropzone>
        <p>{error}</p>
      </div>
    );
  }
}

export default ImageManager;

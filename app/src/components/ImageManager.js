import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import callApi from '../callApi.js';
import ImageDisplayer from './ImageDisplayer.js';

class ImageManager extends Component {
  state = {
    profilePicture: this.props.profile.profilePicture,
    pictures: this.props.profile.pictures,
    error: '',
  };

  onImageDrop = (files) => {
    this.imageUpload(files[0]);
  }

  setProfilePicture = (id) => {
    const url = `/myprofile/pictures/${id}`;
    callApi(url, 'GET')
    .then(({ data: { error, profilePicture } }) => {
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
    .then(({ data: { pictures, error } }) => {
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
    .then(({ data: { error } }) => {
      if (error) {
        this.setState({ error });
      } else {
        const pictures = this.state.pictures.filter(picture => picture !== id);
        this.setState({ pictures });
      }
    });
  }

  render() {
    const { login } = this.props.profile;
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

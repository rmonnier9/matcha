import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import callApi from '../callApi.js';
import Image from './Image.js';

class ImageManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePicture: props.profilePicture,
      pictures: props.pictures,
    };
  }

  onImageDrop = (files) => {
    this.imageUpload(files[0]);
  }

  setProfilePicture = (id) => {
    const url = `/myprofile/pictures/${id}`;
    callApi(url, 'GET')
    .then((json) => {
      const { success } = json.data;
      if (success) {
        this.setState({ profilePicture: id });
      }
    });
  }

  imageUpload = (file) => {
    const url = '/myprofile/pictures';

    const formData = new FormData();
    formData.append('imageUploaded', file);

    callApi(url, 'POST', formData, { 'Content-Type': 'multipart/form-data' })
    .then((json) => {
      const { success, pictures, message } = json.data;
      if (!success) {
        this.setState({ message });
      } else {
        this.setState({ pictures });
      }
    });
  }

  deletePicture = (e) => {
    const { id } = e.currentTarget;
    const url = `/myprofile/pictures/${id}`;
    callApi(url, 'DELETE')
    .then((json) => {
      const { success, message } = json.data;
      if (!success) {
        this.setState({ message });
      } else {
        const pictures = this.state.pictures.filter(picture =>
          (picture !== id ? picture : false));
        this.setState({ pictures });
      }
    });
  }

  render() {
    const { login } = this.props;
    const { pictures } = this.state;
    return (
      <div className="image-manager">
        <Image
          login={login}
          pictures={pictures}
          setProfilePicture={this.setProfilePicture}
          deletePicture={this.deletePicture}
        />
        <Dropzone
          multiple={false}
          accept="image/*"
          onDrop={this.onImageDrop}
        >
          <p>Drop an image or click to select a file to upload.</p>
        </Dropzone>
      </div>
    );
  }
}

export default ImageManager;

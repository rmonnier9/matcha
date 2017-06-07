import React, { Component } from 'react';

import callApi from '../callApi.js';

class Geolocation extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.location);
    this.state = {
      error: false,
      location: this.props.location,
    };
  }

  componentDidMount() {
    const { latitude, longitude } = this.state.location;
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat: latitude, lng: longitude },
    });
    this.marker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      title: 'Me',
    });
    this.marker.setMap(this.map);
  }

  handleClick = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation is not supported by your browser';
      this.setState({ error });
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = '/myprofile';
      callApi(url, 'POST', { coordinates: [longitude, latitude] })
      .then(({ data }) => {
        if (data.success === true) {
          this.marker.setMap(null);
          this.marker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            title: 'Me',
          });
          this.marker.setMap(this.map);
          this.map.setCenter(this.marker.getPosition());
          this.map.setZoom(15);
        } else {
          this.setState({ error: data.message });
        }
      });
    }, () => {
      const error = 'Unable to retrieve your location';
      this.setState({ error });
    });
  }

  render() {
    const { error } = this.state;
    return (
      <div>
        <div id="map" style={{ height: '500px', width: '500px' }} />
        {!error &&
          <button onClick={event => this.handleClick(event)} className="btn btn-primary">
            Geolocate me !
          </button>
        }
        {error &&
          <p>{error}</p>
        }
      </div>
    );
  }
}

export default Geolocation;

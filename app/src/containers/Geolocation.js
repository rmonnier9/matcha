import React, { Component } from 'react';

import callApi from '../callApi';

class Geolocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
    };
  }

  componentDidMount() {
    const { coordinates } = this.props.loc;
    const lng = coordinates[0];
    const lat = coordinates[1];
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat, lng },
    });
    this.marker = new window.google.maps.Marker({
      position: { lat, lng },
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
      callApi(url, 'POST', { longitude, latitude })
      .then((json) => {
        const { error } = json.data;
        if (error) {
          this.setState({ error });
        } else {
          this.marker.setMap(null);
          this.marker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            title: 'Me',
          });
          this.marker.setMap(this.map);
          this.map.setCenter(this.marker.getPosition());
          this.map.setZoom(15);
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
        <button onClick={event => this.handleClick(event)} className="btn btn-primary">
          Geolocate me !
        </button>
        <p>{error}</p>
      </div>
    );
  }
}

export default Geolocation;

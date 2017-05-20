import React, { Component } from 'react'

import callApi from '../callApi.js'

class Geolocation extends Component {
  state = {
    loading: true,
    error: null,
    lattitude: null,
    longitude: null
  }

  componentDidMount = () => {
    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by your browser"
      return (this.setState({error, loading: false}))
    }
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude}  = position.coords
      this.setState({latitude, longitude, loading: false})
    }, () => {
      const error = "Unable to retrieve your location"
      this.setState({loading: false, error})
    })
  }

  render() {
    const {loading, error, latitude, longitude} = this.state
    if (loading)
      return (<p>Locating…</p>)
    if (error)
      return (<p>{error}</p>)
    const srcImg = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                    latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false"
    return (
      <div>
        <p>{"Latitude is " + latitude + "° "}<br/>
        {"Longitude is " + longitude + "°"}</p>
        <img src={srcImg}/>
      </div>
    )
  }
}

export default Geolocation

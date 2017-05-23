import React, { Component } from 'react'

import callApi from '../callApi.js'

class Geolocation extends Component {
  state = {
    completed: false,
    error: false
  }

  handleClick = (e) => {
	 if (!navigator.geolocation) {
		const error = "Geolocation is not supported by your browser"
		return (this.setState({error}))
	 }
	 navigator.geolocation.getCurrentPosition(position => {
		const {latitude, longitude}  = position.coords
		const url = '/myprofile'
		callApi(url, 'POST', {latitude, longitude})
		.then(({ data }) => {
			if (data.success === true)
			{
				this.setState({completed: true})
			}
			else {
				this.setState({error: data.message})
			}
		})
	 }, () => {
		const error = "Unable to retrieve your location"
		this.setState({error})
	 })
  }

  render() {
    const {completed, error} = this.state
    return (
      <div>
			{!error && !completed &&
				<button onClick={(event) => this.handleClick(event)} className="btn btn-primary">
					Geolocate me !
				</button>
			}
			{error &&
				<p>{error}</p>
			}
			{completed &&
				<p>Geolocation succesfully completed !</p>
			}
      </div>
    )
  }
}

export default Geolocation

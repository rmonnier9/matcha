import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

import callApi from '../callApi.js'

import Profile from './Profile.js'
import MyProfileForm from './MyProfileForm.js'
import Geolocation from './Geolocation.js'

class MyProfileContainer extends Component {
	state = {
		profile: null,
		tags: [],
		errorMessage: "",
		fistname: "",
		lastname: "",
	}


	handleSubmit = (event) => {
	  event.preventDefault()
	  const {
		  firstname,
		  lastname,
		  birthDate,
		  gender,
		  lookingFor
	  } = this.state
	  const data = {
							firstname: firstname.trim(),
							lastname: lastname.trim(),
							birthDate: birthDate,
							gender: gender,
							lookingFor: lookingFor,
							tags: this.state.tags
						}
		const url = "/myprofile"
		callApi(url, 'POST', data)
		.then(json => {
			console.log(json);
			const {data} = json
			if (!data.success)
				this.setState({errorMessage: data.message})
		})
	}

	componentDidMount() {
		const url = "/myprofile"
		callApi(url, 'GET')
		.then(json => {
			const {data} = json
			const {profile, message} = data
			if (!data.success)
				this.setState({errorMessage: message})
			else
			{
				const {
					firstname,
					lastname,
					birthDate,
					gender,
					lookingFor,
					tags,
					location
				} = profile
				this.setState({
					firstname,
					lastname,
					birthDate,
					gender,
					lookingFor,
					tags,
					profile,
					location
				})
			}
		})
		.catch(err => {console.log("log error :", err);})
	}

	updateFirstname = (e) => this.setState({ firstname: e.target.value })
	updateLastname = (e) => this.setState({ lastname: e.target.value })
	updateBirthDate = (e) => this.setState({ birthDate: e.target.value })
	updateGender = (e) => this.setState({ gender: e.target.value })
	updateLookingFor = (e) => this.setState({ lookingFor: e.target.value })
	updateTags = (tags) => {this.setState({tags})}

	render(){
		console.log("render", this.state);
		const {
			firstname,
			lastname,
			birthDate,
			gender,
			lookingFor,
			location,
			tags, errorMessage, profile
		} = this.state

		if (!profile) { return (<div><h1>{errorMessage ? errorMessage : "Loading..."}</h1></div>) }
		const token = localStorage.getItem("x-access-token")
		const postImgUrl = "/api/myprofile/pictures?token=" + token
		const postFormUrl = "/api/myprofile?token=" + token
		return (
			<div className="profile">
				{/* <Profile
					profile={profile}
					myprofile={true}
				/> */}
				<h1>{profile.login}</h1>
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
					pictures={profile.pictures}
					login={profile.login}
					location={location}
				/>
			</div>
		)
	}

}


export default MyProfileContainer

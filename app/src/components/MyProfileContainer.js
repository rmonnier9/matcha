import React, { Component } from 'react'

import callApi from '../callApi.js'
import MyProfileForm from './MyProfileForm.js'

class MyProfileContainer extends Component {
	state = {
		profile: null,
		pictures: [],
		tags: [],
		errorMessage: "",
		fistname: "",
		lastname: ""
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
			const {data} = json
			if (!data.success)
				this.setState({errorMessage: data.message})
		})
	}

	onImageDrop = (files) => {
		this.handleImageUpload(files[0])
	}

	handleImageUpload = (file) => {
		const url = "/myprofile/pictures"

		const formData = new FormData();
		formData.append("imageUploaded", file);

		callApi(url, 'POST', formData, { "Content-Type": "multipart/form-data" })
		.then(json => {
			const {data} = json
			const {pictures, message} = data
			if (!data.success)
				this.setState({errorMessage: message})
			else {
				this.setState({pictures})
			}
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
					pictures,
					firstname,
					lastname,
					birthDate,
					gender,
					lookingFor,
					tags,
					location
				} = profile
				this.setState({
					pictures,
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
	handleImageSubmit = (e) => {
		this.setState({ imageUpload: e.target.files })

		const reader = new FileReader()
		const file = e.target.files[0]
		reader.onload = (upload) => {
			this.setState({
				data_uri: upload.target.result,
				filename: file.name,
				filetype: file.type
			})
			let data = {
				data_uri: this.state.data_uri,
				filename: this.state.filename,
				filetype: this.state.filetype
			}
			const url = "/myprofile/pictures/"
			callApi(url, 'POST', data, {
				encType: "multipart/form-data"
			})
			.then(json => {
				console.log(json)
			})
		}
		reader.readAsDataURL(file)
		// e.target.value = null
	}

	deletePicture = (e) => {
		const {id} = e.currentTarget
		const url = "/myprofile/pictures/" + id
		callApi(url, 'DELETE')
		.then(json => {
			const {data} = json
			const {message} = data
			if (!data.success)
			{
				this.setState({errorMessage: message})
			}
			else {
				const pictures = this.state.pictures.filter((picture) =>
					(picture === id ? null : picture))
				this.setState({pictures})
			}
		})
	}

	render(){
		console.log("render", this.state)
		const {
			pictures,
			firstname,
			lastname,
			birthDate,
			gender,
			lookingFor,
			location,
			tags, errorMessage, profile
		} = this.state

		if (!profile) { return (<div><h1>{errorMessage ? errorMessage : "Loading..."}</h1></div>) }
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
					pictures={pictures}
					login={profile.login}
					location={location}
					handleImageSubmit={this.handleImageSubmit}
					onImageDrop={this.onImageDrop}
					deletePicture={this.deletePicture}
				/>
			</div>
		)
	}

}


export default MyProfileContainer

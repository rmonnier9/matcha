import React, { Component } from 'react'

import callApi from '../callApi.js'

import Profile from './Profile.js'

const FormInput = ({ children, label }) =>
	<div className="searchInput">
		<div className="searchLabel">{label}</div>
		{children}
	</div>

class MyProfileContainer extends Component {
	state = {
		profile: null,
		errorMessage: ""
	}

	componentDidMount() {
		const url = "/myprofile"
		callApi(url, 'GET')
		.then(json => {
			console.log(json);
			const {data} = json
			const {profile, message} = data
			if (!data.success)
				this.setState({errorMessage: message})
			else
				this.setState({profile})
		})
		.catch(err => {console.log("log error :", err);})
	}

	render(){
		const { profile, errorMessage } = this.state

		if (!profile) { return (<div><h1>{errorMessage ? errorMessage : "Loading..."}</h1></div>) }
		const token = localStorage.getItem("x-access-token")
		const postImgUrl = "/api/myprofile/pictures?token=" + token
		const postFormUrl = "/api/myprofile?token=" + token
		return (
			<div className="profile">
				<Profile
					profile={profile}
					myprofile={true}
				/>
				<form action={postFormUrl} method="POST">
					<div>
						<label for="name">My name is </label>
						<input class="name" type="text" name="firstname" placeholder="firstname" />
						<input class="name" type="text" name="lastname" placeholder="lastname" />
					</div>
					<br/>
					<div>
						<label for="bday">My birthday is...</label>
						<input id="bday" type="date" name="birthDate" placeholder="birthDate" />
					</div>
					<br/>
					<div>
						<label for="gender">I'm a...</label>
						<input id="gender" type="radio" name="gender" value="male"/>Dude
						<input id="gender" type="radio" name="gender" value="female"/>Girl
					</div>
					<br/>
					<div>
						<label for="lookingFor">I want to have fun with a...</label>
						<input id="lookingFor" type="radio" name="lookingFor" value="male"/>Dude
						<input id="lookingFor" type="radio" name="lookingFor" value="female"/>Girl
						<input id="lookingFor" type="radio" name="lookingFor" value="both"/>Whatever
					</div>
					<br/>
					<input type="submit" value="submit" />
				</form>
				<br />
				<br />
				<span>Profile Picture</span>
				<form action={postImgUrl} method="POST">
					<input type="file" name="image" />
					<input type="submit" value="submit" />
				</form>
			</div>
		)
	}

}


export default MyProfileContainer

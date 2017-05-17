import React, { Component } from 'react'

import callApi from '../callApi.js'

import Profile from './Profile.js'

class MyProfileContainer extends Component {
	state = {
		data: null,
		success: false
	}

	componentDidMount() {
		const url = "/myprofile"
		callApi(url, 'GET').then(json => {
			console.log(json);
			const {data} = json
			this.setState({data})
		})
	}

	render(){
		const { data, success } = this.state

		if (!data) { return (<div><h1>Loading...</h1></div>) }
		const {profile, message} = data
		const token = localStorage.getItem("x-access-token")
		const postImgUrl = "/api/myprofile/pictures?token=" + token
		const postFormUrl = "/api/myprofile?token=" + token
		return (
			<div className="profile">
				<Profile
					profile={profile}
				/>
				<form action={postFormUrl} method="POST">
					<input type="text" name="birthDate" />
					<input type="submit" value="submit" />
				</form>
				<form action={postImgUrl} method="POST">
					<input type="file" name="image" />
					<input type="submit" value="submit" />
				</form>
			</div>
		)
	}

}


export default MyProfileContainer

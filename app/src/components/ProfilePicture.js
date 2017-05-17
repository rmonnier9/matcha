import React from 'react'

const ProfilePicture = (props) => {
	const {login, pictures, profilePicture} = props
	const img = pictures[profilePicture]
	const token = localStorage.getItem('x-access-token')
	const url = "/api/pictures/" + login + "/" + img + "?token=" + token
	console.log(url);
	return (
	  <div className="profile-picture">
	    <img alt="profile" src={url} />
	  </div>
	)
}

export default ProfilePicture

import React, {Component} from 'react'

import ProfilePicture from './ProfilePicture.js'

class EncartLeft extends Component {
	render() {
		const {profile} = this.props
		const {
			login,
			profilePicture,
			pictures,
			firstname,
			lastname,
			popularity,
			lastConnection
		} = profile

		return (
		  <div className="encart-left">
			 {profile.hasOwnProperty('profilePicture') &&
				 <ProfilePicture
					 login={login}
					 profilePicture={profilePicture}
					 pictures={pictures}
				 />
			 }
			 <div className="profile-name">
		      <span>{firstname} </span>
		      <span>{lastname}</span>
		    </div>
			<div className="popularity">
			  <span>{popularity}</span>pts.
			</div>
			<div className="lastConnection">
				<span>{lastConnection}</span>
			</div>
		  </div>
		)
	}
}

export default EncartLeft

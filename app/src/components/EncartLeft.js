import React, {Component} from 'react'

import ProfilePicture from './ProfilePicture.js'
import Name from './Name.js'
import Popularity from './Popularity.js'

class EncartLeft extends Component {
	render() {
		const {profile} = this.props
		const {lastConnection} = profile
		return(
		  <div className="encart-left">
			 {profile.hasOwnProperty('profilePicture') &&
				 <ProfilePicture
					 login={profile.login}
					 profilePicture={profile.profilePicture}
					 pictures={profile.pictures}
				 />
			 }
		    <Name
			 	firstname={profile.firstname}
				lastname={profile.lastname}/>
		    <Popularity
				popularity={profile.popularity}/>
			<div className="lastConnection">
				<span>{lastConnection}</span>
			</div>
		  </div>
		)
	}
}

export default EncartLeft

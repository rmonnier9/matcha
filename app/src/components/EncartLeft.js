import React from 'react'

import ProfilePicture from './ProfilePicture.js'
import Name from './Name.js'
import Popularity from './Popularity.js'

const EncartLeft = ({profile}) => (
  <div className="encart-left">
    <ProfilePicture
		 login={profile.login}
		 profilePicture={profile.profilePicture}
		 pictures={profile.pictures}
	 />
    <Name
	 	firstname={profile.firstname}
		lastname={profile.lastname}/>
    <Popularity
		popularity={profile.popularity}/>
  </div>
)

export default EncartLeft

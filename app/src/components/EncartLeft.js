import React from 'react'

import ProfilePicture from './ProfilePicture.js'
import Name from './Name.js'
import Popularity from './Popularity.js'

const EncartLeft = ({profile}) => {console.log(profile); return(
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
  </div>
)}

export default EncartLeft

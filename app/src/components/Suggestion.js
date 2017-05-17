import React from 'react'

import ProfilePicture from './ProfilePicture.js'
import Name from './Name.js'
import Popularity from './Popularity.js'

const Suggestion = () => (
  <div className="suggestion">
    <ProfilePicture />
    <Name />
    <Popularity />
  </div>
)

export default Suggestion

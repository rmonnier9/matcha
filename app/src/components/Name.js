import React from 'react'

const ProfileName = (props) => (
  <div className="profile-name">
    <span>{props.firstname}</span>
    <span>{props.lastname}</span>
  </div>
)

export default ProfileName

import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'

import 'react-tagsinput/react-tagsinput.css'

import Geolocation from './Geolocation.js'
import Image from './Image.js'

class MyProfileForm extends Component {
	render(){
		console.log(this.props);
		const {
			handleSubmit,
			firstname,
			updateFirstname,
			lastname,
			updateLastname,
			birthDate,
			updateBirthDate,
			gender,
			updateGender,
			lookingFor,
			updateLookingFor,
			tags,
			updateTags,
			pictures,
			login,
		} = this.props

		return (
			<div className="myprofileform">
				<Image
					pictures={pictures}
					login={login}
				/>
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="name">My name is </label>
						<input className="name" type="text" ref="firstname" placeholder="firstname"
							onChange={updateFirstname}
							value={firstname}
						/>
						<input className="name" type="text" ref="lastname" placeholder="lastname"
							onChange={updateLastname}
							value={lastname}
						/>
					</div>
					<br/>
					<div>
						<label htmlFor="bday">My birthday is...</label>
						<input id="bday" type="date" ref="birthDate" placeholder="birthDate"
							onChange={updateBirthDate}
							value={birthDate}
						/>
					</div>
					<br/>
					<div>
						<label htmlFor="gender">I'm a...</label>
						<input id="gender" type="radio" name="gender" ref="gender" value="male"
							onChange={updateGender}
							checked={"male" === gender}
						/>Dude
						<input id="gender" type="radio" name="gender" ref="gender" value="female"
							onChange={updateGender}
							checked={"female" === gender}
						/>Girl
					</div>
					<br/>
					<div>
						<label htmlFor="lookingFor">I want to have fun with a...</label>
						<input id="lookingFor" type="radio" name="lookingFor" ref="lookingFor" value="male"
							onChange={updateLookingFor}
							checked={"male" === lookingFor}
						/>Dude
						<input id="lookingFor" type="radio" name="lookingFor" ref="lookingFor" value="female"
							onChange={updateLookingFor}
							checked={"female" === lookingFor}
						/>Girl
						<input id="lookingFor" type="radio" name="lookingFor" ref="lookingFor" value="both"
							onChange={updateLookingFor}
							checked={"both" === lookingFor}
						/>Whatever
					</div>
					<br/>
					<TagsInput value={tags} onChange={updateTags} />
					<input type="submit" name="submit" value="Save my changes"/>
				</form>
				<br />
				{/* <form action={postImgUrl} method="POST" encType="multipart/form-data">
					<input type="file" name="image" />
					<input type="submit" value="submit" />
				</form> */}
				<Geolocation />
			</div>
		)
	}

}


export default MyProfileForm

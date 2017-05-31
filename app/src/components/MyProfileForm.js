import React, { Component } from 'react'
import TagsInput from 'react-tagsinput'
import Dropzone from 'react-dropzone'

import 'react-tagsinput/react-tagsinput.css'

import Geolocation from './Geolocation.js'
import Image from './Image.js'

class MyProfileForm extends Component {
	render(){
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
			location,
			handleImageSubmit,
			onImageDrop,
			deletePicture
		} = this.props

		return (
			<div className="myprofileform">
				<Image
					pictures={pictures}
					login={login}
					deletePicture={deletePicture}
				/>
				<Dropzone
					multiple={false}
					accept="image/*"
					onDrop={onImageDrop}>
					<p>Drop an image or click to select a file to upload.</p>
				</Dropzone>
				<input type="file" accept="image/*"
					onChange={handleImageSubmit}
				/>
				<br />
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="name">My name is </label>
						<input className="name" type="text" placeholder="firstname"
							onChange={updateFirstname}
							value={firstname}
						/>
						<input className="name" type="text" placeholder="lastname"
							onChange={updateLastname}
							value={lastname}
						/>
					</div>
					<br/>
					<div>
						<label htmlFor="bday">My birthday is...</label>
						<input id="bday" type="date" placeholder="birthDate"
							onChange={updateBirthDate}
							value={birthDate}
						/>
					</div>
					<br/>
					<div>
						<label htmlFor="gender">I'm a...</label>
						<input id="gender" type="radio" name="gender" value="male"
							onChange={updateGender}
							checked={"male" === gender}
						/>Dude
						<input id="gender" type="radio" name="gender" value="female"
							onChange={updateGender}
							checked={"female" === gender}
						/>Girl
					</div>
					<br/>
					<div>
						<label htmlFor="lookingFor">I want to have fun with a...</label>
						<input id="lookingFor" type="radio" name="lookingFor" value="male"
							onChange={updateLookingFor}
							checked={"male" === lookingFor}
						/>Dude
						<input id="lookingFor" type="radio" name="lookingFor" value="female"
							onChange={updateLookingFor}
							checked={"female" === lookingFor}
						/>Girl
						<input id="lookingFor" type="radio" name="lookingFor" value="both"
							onChange={updateLookingFor}
							checked={"both" === lookingFor}
						/>Whatever
					</div>
					<br/>
					<TagsInput value={tags} onChange={updateTags} />
					<input type="submit" name="submit" value="Save my changes"/>
				</form>
				<br />
				<Geolocation
					location={location}
				/>
			</div>
		)
	}

}


export default MyProfileForm

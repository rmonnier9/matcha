import React, {Component}				from 'react'

import callApi								from '../callApi.js'

export default class Image extends Component {
	render() {
		const { pictures, login, deletePicture } = this.props
		const token = localStorage.getItem('x-access-token')
		let url
		const imgList = pictures.map((picture, key) => {
			url = "/api/pictures/" + login + "/" + picture + "?token=" + token
			return (
				<div
					key={key}
					onClick={deletePicture}
					id={picture}
				>
					<img src={url}/>
				</div>
			)
		})
		return (
			<div className="imageProf">
				{imgList}
			</div>
		)
	}
}

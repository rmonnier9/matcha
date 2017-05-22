import React						from 'react'


export default class Image extends React.Component {
	constructor() {
		super()
		this.state = {
				selectedImage: null,
				availableImages: [],
				inEdit: false,
				marginLeft: 0,
		}
	}


	render() {
		const { availableImages, marginLeft } = this.state
		const { pictures, login } = this.props.profile
		const token = localStorage.getItem('x-access-token')
		let url
		const imgList = pictures.map((img, key) => {
			url = "/api/pictures/" + login + "/" + img + "?token=" + token
			return (
				<li key={key} className="img" >
					<img src={url}/>
				</li>
			)
		})
		console.log(imgList);
		return (
			<div className="imageProf">
				<ul className="listIMG">
					{imgList}
				</ul>
			</div>
		);
	}
}
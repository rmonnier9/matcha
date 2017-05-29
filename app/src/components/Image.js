import React, {Component}				from 'react'


export default class Image extends Component {
	render() {
		const { pictures, login } = this.props
		const token = localStorage.getItem('x-access-token')
		let url
		const imgList = pictures.map((img, key) => {
			url = "/api/pictures/" + login + "/" + img + "?token=" + token
			return (
				<li key={key} className="img" >
					<img alt={img} src={url}/>
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
		)
	}
}

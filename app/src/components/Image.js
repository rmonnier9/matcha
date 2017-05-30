import React, {Component}				from 'react'
import Lightbox from 'react-images'


export default class Image extends Component {
	this.state {
		currentImage: 0,
		lightboxIsOpen: false,

	}
	openLightbox = (index, event) => {
		event.preventDefault();
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		});
	}
	closeLightbox = () => {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		})
	}
	gotoPrevious = () => {
		this.setState({
			currentImage: this.state.currentImage - 1,
		})
	}
	gotoNext = () => {
		this.setState({
			currentImage: this.state.currentImage + 1,
		})
	}
	renderGallery () {
		const { images } = this.props;

		if (!images) return;

		const gallery = images.filter(i => i.useForDemo).map((obj, i) => {
			return (
				<a
					href={obj.src}
					className={css(classes.thumbnail, classes[obj.orientation])}
					key={i}
					onClick={(e) => this.openLightbox(i, e)}
					>
						<img src={obj.thumbnail} className={css(classes.source)} />
					</a>
				)
			})

			return (
				<div className={css(classes.gallery)}>
					{gallery}
				</div>
			)
		}

	render() {
		const { pictures, login } = this.props
		const token = localStorage.getItem('x-access-token')
		let url
		const imgList = pictures.map((img, key) => {
			url = "/api/pictures/" + login + "/" + img + "?token=" + token
			return ( {src: url} )
		})
		console.log(imgList);
		return (
			<div className="imageProf">
				<ul className="listIMG">
					<Lightbox
						images={imgList}
						isOpen={this.state.lightboxIsOpen}
						onClickPrev={this.gotoPrevious}
						onClickNext={this.gotoNext}
						onClose={this.closeLightbox}
					/>

					{imgList}
				</ul>
			</div>
		)
	}
}

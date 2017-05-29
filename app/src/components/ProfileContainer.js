import React from 'react'

import callApi from '../callApi.js'

import Profile from './Profile.js'


class ProfileContainer extends React.Component{
	constructor(){
		super()
		this.state = {
							data: null,
							alreadyBlocked: false,
							alreadyLiked: false}
	}

	onLikeClick = (e, likes) => {
		const {login} = this.props.match.params
		const url = '/likes/' + login
		callApi(url, 'POST', {likes})
		.then(({ data }) => {
			console.log("result like", data);
			console.log(likes);
			if (data.success === true)
			{
				if (likes === true) {
					this.setState({alreadyLiked: true})
				}
				else {
					this.setState({alreadyLiked: false})
				}
			}
		})
	}

	onBlockClick = (e, blocks) => {
		const {login} = this.props.match.params
		const url = '/blocks/' + login
		callApi(url, 'POST', {blocks})
		.then(({ data }) => {
			if (data.success === true)
			{
				if (blocks === true) {
					this.props.history.push('/')
				}
				else {
					this.setState({alreadyBlocked: false})
				}
			}
		})
	}

	onReportClick = (e) => {
		const {login} = this.props.match.params
		const url = '/reports/' + login
		callApi(url, 'POST')
		.then(({ data }) => {
			if (data.success === true) {
				this.props.history.push('/')
			}
		})
	}

	componentDidMount() {
		const {url} = this.props.match
		callApi(url, 'GET').then(json => {
			const {data} = json
			this.setState({data})
		})
		const {login} = this.props.match.params
		const alreadyBlockedURL = '/blocks/' + login
		callApi(alreadyBlockedURL, 'GET').then(json => {
			const {data} = json
			const {alreadyBlocked} = data
			if (alreadyBlocked) this.setState({alreadyBlocked})
		})
		const alreadyLikedURL = '/likes/' + login
		callApi(alreadyLikedURL, 'GET').then(json => {
			const {data} = json
			console.log("result lie", data);
			const {alreadyLiked} = data
			if (alreadyLiked) this.setState({alreadyLiked})
		})
	}

	render(){
		const { data, alreadyBlocked, alreadyLiked } = this.state

		if (!data) { return (<div><h1>Loading...</h1></div>) }
		const {profile} = data
		console.log("RENDER", profile);
		return (
			<div className="profile">
				<Profile
					profile={profile}
					onReportClick={this.onReportClick}
					onBlockClick={this.onBlockClick}
					alreadyBlocked={alreadyBlocked}
					onLikeClick={this.onLikeClick}
					alreadyLiked={alreadyLiked}
					myprofile={false}
				/>
			</div>
		)
	}

}


export default ProfileContainer

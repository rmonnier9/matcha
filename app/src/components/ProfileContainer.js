import React from 'react'

import callApi from '../callApi.js'

import Profile from './Profile.js'


class ProfileContainer extends React.Component{
	constructor(){
		super()
		this.state = {data: null, alreadyBlocked: false}
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
		const alreadyBlockURL = '/blocks/' + login
		callApi(alreadyBlockURL, 'GET').then(json => {
			const {data} = json
			const {alreadyBlocked} = data
			if (alreadyBlocked) this.setState({alreadyBlocked})
		})
	}

	render(){
		const { data, alreadyBlocked } = this.state

		if (!data) { return (<div><h1>Loading...</h1></div>) }
		const {profile, message} = data
		console.log("ere", data);
		console.log(profile);
		return (
			<div className="profile">
				<Profile
					profile={profile}
					onReportClick={this.onReportClick}
					onBlockClick={this.onBlockClick}
					alreadyBlocked={alreadyBlocked}
				/>
			</div>
		)
	}

}


export default ProfileContainer

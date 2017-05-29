import React, {Component} 		from 'react'

class LookingFor extends Component {
	render() {
		const {lookingFor} = this.props

		let message
		if (lookingFor === 'both')
			message = 'girls and dudes'
		else if (lookingFor === 'male')
			message = 'dudes'
		else if (lookingFor === 'female')
			message = 'girls'
		else
			message = ''

		return (
			<div className="lookingFor">
				looking for <span>{message}</span>
			</div>
		)
	}
}

export default LookingFor

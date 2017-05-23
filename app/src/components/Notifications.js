import React, {Component} from 'react'

import callApi						from '../callApi.js'

const NotificationsList = (props) => (
	<div className='notifications'>
		 <h2> Notifications: </h2>
		 {
			  props.notifications.map((notification, i) => {
					return (
						 <div key={i}>
							 <strong>{i} : </strong>
							 <span>{notification}</span>
						 </div>
					)
			  })
		 }
	</div>
)


class Notifications extends Component {
  state = {
	  notifications: []
  }

	componentDidMount() {
		const url = '/notifications'
		callApi(url, 'GET')
		.then(({ data }) => {
			console.log("chat", data);
			if (data.success === true)
			{
				const {notifications} = data
				if (notifications.length !== 0) {
					this.setState({notifications})
				}
			}
		})
	}

  render() {
	  return (
		  <div className="notifications">
			  <h2>My notifications</h2>
			  <NotificationsList
				  notifications={this.state.notifications}
			  />
		  </div>
	  )
  }
}

export default Notifications

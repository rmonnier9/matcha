import React, {Component}			from 'react'

import callApi							from '../callApi.js'

const NotificationsList = (props) => (
	<div className='notifications'>
		 <h2> Notifications: </h2>
		 {
			  props.notifications.map((notification, i) => {
					return (
						 <div key={i}>
							 <span>{notification.content}</span><br/>
							 on <span>{new Date(notification.date).toDateString()}</span>
						 </div>
					)
			  })
		 }
	</div>
)


class Notifications extends Component {
  state = {
	  notifications: [],
	  hasMoreItems: true,
	  nextHref: null
  }

  loadItems = () => {
	  const { nextHref, hasMoreItems } = this.state
	  let url
	  if (!nextHref || !hasMoreItems) {
		 url = '/notifications'
	  }
	  else {
		  url = nextHref
	  }
		callApi(url, 'GET')
		.then(({ data }) => {
			const notifications = [...this.state.notifications, ...data.notifications]

			if (data.nextHref) {
				 this.setState({
					 notifications,
					 nextHref: data.nextHref
				  })
			} else {
				 this.setState({
					 notifications,
					 hasMoreItems: false,
					 nextHref: null
				  })
			}
		})
	  }

	componentDidMount() {
		this.loadItems()
	}

  render() {
	//   console.log("RENDER", this.state)
	  const {notifications, hasMoreItems} = this.state
	  return (
		  <div className="notifications">
			  <h2>My notifications</h2>
			  <NotificationsList
				  notifications={notifications}
			  />
			  {hasMoreItems &&
				  <button onClick={this.loadItems}>See more</button>
			  }
		  </div>
	  )
  }
}

export default Notifications

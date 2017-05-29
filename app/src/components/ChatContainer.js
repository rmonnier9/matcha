import React, {Component}		from 'react'
import io							from 'socket.io-client'

import callApi						from '../callApi.js'
const socket = io()

class Message extends Component {
  render() {
	  const {from, target, text} = this.props
      return (
          <div className="message">
              <strong>{from === target ? from : "me"} : </strong>
              <span>{text}</span>
          </div>
      )
  }
}

class MessageList extends Component {
  render() {
      return (
          <div className='messages'>
              <h2> Conversation: </h2>
              {
                  this.props.messages.map((message, i) => {
                      return (
                          <Message
                              key={i}
                              from={message.from}
                              text={message.text}
										target={this.props.target}
                          />
                      );
                  })
              }
          </div>
      )
  }
}

class MessageForm extends Component {

  state = {
	  text: ''
  }

  handleSubmit = (e) => {
      e.preventDefault();
      const message = {
          target : this.props.user,
          text : this.state.text
      }
      this.props.onMessageSubmit(message)
      this.setState({ text: '' })
  }

  changeHandler = (e) => {
      this.setState({ text : e.target.value })
  }

  render() {
      return(
          <div className='message_form'>
              <h3>Write New Message</h3>
              <form onSubmit={this.handleSubmit}>
                  <input
                      onChange={this.changeHandler}
                      value={this.state.text}
                  />
              </form>
          </div>
      )
  }
}

class ChatContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			users: [],
			messages:[],
			text: '',
			target: props.match.params.login
		}
	}

    componentDidMount = () => {
		const token = localStorage.getItem('x-access-token')
		socket.emit('auth', token)
		socket.on('message', this._messageReceive)

		const {login} = this.props.match.params
		const url = '/chat/' + login
		callApi(url, 'GET')
		.then(({ data }) => {
			console.log("chat", data);
			if (data.success === true)
			{
				const {messages} = data
				if (messages.length !== 0) {
					this.setState({messages})
				}
			}
		})
    }

    _messageReceive = ({text, from, target}) => {
		console.log(text, from)
		if (from !== this.state.target)
			return ;
		const {messages} = this.state
		messages.push({from, target, text})
		this.setState({messages})
    }

    handleMessageSubmit = (message) => {
        const {messages} = this.state
        messages.push(message)
        this.setState({messages})
        socket.emit('message', message)
    }


    render() {
		 console.log("RENDER", this.state.messages, this.state);
        return (
            <div>
                <MessageList
                    messages={this.state.messages}
						  target={this.state.target}
                />
                <MessageForm
                    onMessageSubmit={this.handleMessageSubmit}
                    user={this.state.target}
                />
            </div>
        )
    }
}

export default ChatContainer

import React, {Component}		from 'react'
import ReactDOM					from 'react-dom'
import { browserHistory }		from 'react-router'
import callApi						from '../callApi.js'
import io from 'socket.io-client'
const socket = io()

class Message extends Component {
  render() {
      return (
          <div className="message">
              <strong>{this.props.user} :</strong>
              <span>{this.props.text}</span>
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
                              user={message.user}
                              text={message.text}
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
          user : this.props.user,
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
		console.log(socket);
		socket.emit('auth', token)
		socket.on('message', this._messageReceive)
    }

    _messageReceive = ({message, from}) => {
		console.log(message, from)
		console.log(this.state.target, from);
		if (from !== this.state.target)
			return ;
		const {messages} = this.state
		messages.push({message, user: from})
		this.setState({messages})
    }

    handleMessageSubmit = (message) => {
        const {messages, target} = this.state
        messages.push(message)
        this.setState({messages})
		  const {text} = message
		  const data = {message: text, target}
        socket.emit('message', data)
    }


    render() {
        return (
            <div>
                <MessageList
                    messages={this.state.messages}
                />
                <MessageForm
                    onMessageSubmit={this.handleMessageSubmit}
                    user={this.state.user}
                />
            </div>
        )
    }
}

export default ChatContainer

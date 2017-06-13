import React, { Component } from 'react';
import io from 'socket.io-client';
import callApi from '../callApi';

const socket = io();

const Message = ({ from, target, text }) => (
  <div className="message">
    <strong>{from === target ? from : 'me'} : </strong>
    <span>{text}</span>
  </div>
);

const MessageList = ({ messages, target }) => (
  <div className="messages">
    <h2> Conversation: </h2>
    {
      messages.map((message, index) => (
        <Message
          key={index}
          from={message.from}
          text={message.text}
          target={target}
        />
      ))
    }
  </div>
);

class MessageForm extends Component {
  state = {
    text: '',
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const message = {
      target: this.props.user,
      text: this.state.text,
    };
    this.props.onMessageSubmit(message);
    this.setState({ text: '' });
  }

  changeHandler = (e) => {
    this.setState({ text: e.target.value });
  }

  render() {
    return (
      <div className="message_form">
        <h3>Write New Message</h3>
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.changeHandler}
            value={this.state.text}
          />
        </form>
      </div>
    );
  }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      error: '',
    };
    this.target = props.match.params.login;
  }

  componentDidMount = () => {
    const token = localStorage.getItem('x-access-token');
    socket.emit('auth', token);
    socket.on('message', this.messageReceive);

    const { login } = this.props.match.params;
    const url = `/chat/${login}`;
    callApi(url, 'GET')
    .then(({ data: { error, messages } }) => {
      if (error) {
        this.setState({ error });
      } else if (messages.length !== 0) {
        this.setState({ messages });
      }
    });
  }

  messageReceive = ({ text, from, target }) => {
    if (from !== this.target) { return; }
    const { messages } = this.state;
    messages.push({ from, target, text });
    this.setState({ messages });
  }

  handleMessageSubmit = (message) => {
    const { messages } = this.state;
    messages.push(message);
    this.setState({ messages });
    socket.emit('message', message);
  }


  render() {
    // console.log('RENDER', this.state.messages, this.state);
    return (
      <div>
        <MessageList
          messages={this.state.messages}
          target={this.target}
        />
        <MessageForm
          onMessageSubmit={this.handleMessageSubmit}
          user={this.target}
        />
      </div>
    );
  }
}

export default Chat;

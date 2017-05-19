import React					from 'react';
import ReactDOM					from 'react-dom';
import { browserHistory }		from 'react-router';

import callApi from 			'../callApi.js'


import './chats.sass';

const checkLastChar = (last) => {
	return (
		!((last >= 'A' && last <= 'Z') ||
		(last >= 'a' && last <= 'z') ||
		(last >= '0' && last <= '9') ||
		last === '?' || last === '!') && last !== ' ');
};

class ChatRoom extends React.Component {

	sendMessage = async (e) => {
		e.preventDefault();
		e.persist();
		if (!e.target.message.value.match(/[A-Za-z0-9?!]/)) return (false);
		if (e.target.message.value === '' || !e.target.message.value) return (false);
		const messageData = {
			recipient: this.props.to,
			message: e.target.message.value,
		};
		await this.props.sendMessage(messageData);
		e.target.message.value = '';
		this.scrollBottom();
	}

	handleChange = (e) => {
		const { value } = e.target;
		const lastChar = e.target.value.slice(-1);
		if (checkLastChar(lastChar)) {
			e.target.value = value.substring(0, value.length - 1);
			return (false);
		}
	}

	scrollBottom = () => {
		const chat = ReactDOM.findDOMNode(this);
		if (chat) {
			const messageList = chat.querySelector('ul');
			if (messageList) messageList.scrollTop = messageList.scrollHeight;
		}
	}

	componentDidMount() {
		this.scrollBottom();
	}

	componentWillReceiveProps = (newProps) => {
		setTimeout(() => this.scrollBottom(), 20);
	}

	render() {
		if (!this.props.messages) return (<div></div>);
		const messages = this.props.messages.map((el, key) =>
				<li key={key} className={`message ${el.author === this.props.to ? 'to' : 'me' }`}>
					{el.message}
				</li>
		);
		return(
			<div className="chatRoom">
				<FlipMove typeName="ul" className="messageList" leaveAnimation={false}>
					{messages}
				</FlipMove>
				<form onSubmit={this.sendMessage}>
					<input type="text" name="message" className="textInp" autoComplete="off" onChange={this.handleChange}/>
					<RippledButton butType="submit" value="SEND" />
				</form>
			</div>
		);
	}
}

export default class Chat extends React.Component {

	state = {
		auth: false,
		data: null,
		selectedChat: 0,
	}

	setChat = (key) => {
		this.setState({ selectedChat: key, rooms: this.drawRoom(this.state.data, key) });
	}

	sendMessage = (messageData) => {
		global.socket.emit('send message', messageData);
		const newData = this.state.data.map((room) => {
			if (room.user.username === messageData.recipient) {
				room.messages.push({ author: 'me', message: messageData.message });
				return (room);
			} else return (room);
		});
		this.setState({ data: newData });
	};

	drawRoom = (data, selected) => data.map((el, key) =>
		<li onClick={ () => this.setChat(key) } key={key} className="miniChat">
			<div
				className={`thumbChat ${selected === key ? 'selected' : ''}`}
				style={{ backgroundImage: `url('${apiConnect}user/get_img_src/min/${el.user.image}')` }}
			/>
			<span>{el.user.username}</span>
		</li>
	);

	componentWillMount() {
		axios.get(`${apiConnect}user/get_self_interest`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('logToken')}`,
			},
		}).then(({ data }) => {
			if (!this._mounted) return (false);

			if (data.status === false) {
				if (data.details === 'user unauthorized') browserHistory.push('/');
			} else {
				this.setState({
					auth: true,
					data: data.more,
				});
				if (!global.socket) return (false);
				global.socket.on('receive message', (messageData) => {
					const newData = this.state.data.map((room) => {

						if (room.user.username === messageData.author) {
							room.messages.push(messageData);
							return (room);
						} else return (room);
					});
					this.setState({ data: newData });
				});
			}
		});
	}


	render() {
		const { auth, data, selectedChat } = this.state;
		if (!auth) return (<div className="comp"></div>);
		if (data && data.length === 0) {
			return (
				<div className="comp">
					<h1 className="mainTitle">NO AVAILABLE CHAT</h1>
					<p className="noChatMess">YOU MUST BE CONNECTED WITH AT LEAST ONE USER TO CHAT</p>
				</div>
			);
		}
		const rooms = this.drawRoom(data, this.state.selectedChat);
		return (
			<div className="matcha">
				<h1 className="mainTitle">CHAT</h1>
				<ul className="rooms">{rooms}</ul>
				{data && <ChatRoom
							messages={data[selectedChat].messages}
							to={data[selectedChat].user.username}
							sendMessage={this.sendMessage}
						/>
				}
			</div>
		);
	}
}



export default class Chat extends React.Component {

	state = {
		auth: false,
		data: null,
		selectedChat: 0,
	}

	componentDidMount() {
		const url = '/myprofile'
		callApi(url, 'GET').then(({ data }) => {
			if (!this._mounted) return (false);

			if (data.status === false) {
				if (data.details === 'user unauthorized') browserHistory.push('/');
			} else {
				this.setState({
					auth: true,
					data: data.more,
				});
				if (!global.socket) return (false);
				global.socket.on('receive message', (messageData) => {
					const newData = this.state.data.map((room) => {

						if (room.user.username === messageData.author) {
							room.messages.push(messageData);
							return (room);
						} else return (room);
					});
					this.setState({ data: newData });
				});
			}
		});
	}


	render() {
		return (
			<div className="chat">
				<h1 className="mainTitle">Chat</h1>
				<ul className="rooms">{rooms}</ul>
				{data && <ChatRoom
							messages={data[selectedChat].messages}
							to={data[selectedChat].user.username}
							sendMessage={this.sendMessage}
						/>
				}
			</div>
		)
	}

}

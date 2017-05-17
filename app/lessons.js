import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {
	constructor(){
		super()
		this.state = {val: 0}
		this.update = this.update.bind(this)
	}
	update(){
		this.setState({val: this.state.val + 1})
	}
  render(){
    return <Title text="The Text"/>
  }
  componentDidMount(){
	  console.log(ReactDOM.findDOMNode(this));
	  this.inc = setInterval(this.update, 500)
  }
  componentWillUnmount(){
	  clearInterval(this.inc)
  }
}

const Title = (props) => <h1>{props.text}</h1>

Title.propTypes = {
  text: React.propTypes.string.isRequired
  text(props, propName, component){
    if (!(propName in props)) {
      return new Error(`missing ${propName}`)
    }
  }
}

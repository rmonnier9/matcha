import React from 'react'

import Age from './Age.js'
import Quote from './Quote.js'
import Localisation from './Localisation.js'
import Tags from './Tags.js'

const EncartRight = (props) => (
  <div className="encart-right">
    <Age age={props.age}/>
    <Localisation />
    <Quote />
    <Tags />
  </div>
)

export default EncartRight

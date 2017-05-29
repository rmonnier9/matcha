import React from 'react'

const Tags = (props) => (
	<div className="tags">
	{
		 props.tags.map((tag, i) => {
			  return (
					<span key={i}>#{tag} </span>
			  )
		 })
	}
	</div>
)

export default Tags
